<template>
  <div>
    <!-- 头部面包屑区域 -->
    <my-bread />

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="username" label="用户名" width="200"></el-table-column>
        <el-table-column align="center" prop="createdAt" label="创建时间">
          <template v-slot:default="slotProps">{{slotProps.row.createdAt | fromateDate}}</template>
        </el-table-column>
        <el-table-column align="center" prop="updatedAt" label="更新时间">
          <template v-slot:default="slotProps">{{slotProps.row.updatedAt | fromateDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updateUser(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(slotProps.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          :total="userList.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[1,2,5,10]"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加/修改用户对话框区域 -->
    <el-dialog
      :title="isUpdate ? '修改用户' : '添加用户'"
      :visible.sync="isShowDialog"
      @close="dialogClose"
    >
      <el-form ref="form" :model="addUserForm" :rules="addUserRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { fromateDate } from "../../utils/dateUtils";
import { addUser, updateUser, delUser } from "../../api";

export default {
  data() {
    return {
      addUserForm: {
        username: "",
        password: ""
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      isShowDialog: false,
      isUpdate: false
    };
  },
  computed: {
    ...mapState({
      userList: state => state.adminUser.adminUserList,
      user: state => state.adminUser.adminUser
    })
  },
  filters: {
    fromateDate
  },

  created() {
    this.$store.dispatch("getUserList");
  },

  methods: {
    /**
     * 打开添加/修改用户对话框
     */
    openAddUserDialog() {
      if (this.addUserForm._id) {
        delete this.addUserForm._id;
      }
      this.isUpdate = false;
      this.isShowDialog = true;
    },
    /**
     * 关闭对话框
     */
    closeDialog() {
      this.isShowDialog = false;
    },
    /**
     * 对话框点击确定按钮: 添加/修改用户
     */
    async addOrUpdateUser() {
      if (!this.isUpdate) {
        // 添加
        await addUser(this.addUserForm);
      } else {
        // 修改
        await updateUser(this.addUserForm);
      }
      this.$message({
        message: `${this.isUpdate ? "修改成功!" : "添加成功!"}`,
        type: "success"
      });
      this.$store.dispatch("getUserList");
      this.isShowDialog = false;
    },
    /**
     * 对话框关闭后清空表单
     */
    dialogClose() {
      this.$refs.form.resetFields();
    },
    /**
     * 点击修改按钮: 修改用户
     */
    updateUser(user) {
      this.isUpdate = true;
      this.isShowDialog = true;
      this.addUserForm._id = user._id;
      // 在对话框的生命周期之后再赋值, 这样子就可以保证初始值一定是空值
      this.$nextTick(() => {
        this.addUserForm.username = user.username;
      });
    },
    delUser(user) {
      this.$confirm("确定删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          if (user._id === this.user._id) {
            this.$message({
              type: "error",
              message: "不能删除当前登录用户!"
            });
            return;
          }
          await delUser(user);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$store.dispatch("getUserList");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
