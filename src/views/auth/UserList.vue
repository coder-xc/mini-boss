<template>
  <div>
    <!-- 头部面包屑区域 -->
    <my-bread />

    <!-- 卡片区域 -->
    <el-card class="filter">
      <el-row>
        <el-col class="input" :xs="24" :md="8">
          <el-input
            class="input"
            v-model="searchQuery.where.username.$regex"
            placeholder="请输入用户名"
            clearable
            @clear="clearSearch"
            @keyup.enter.native="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- <el-col class="search" :xs="8" :md="3">
          <el-button type="primary" @click="getUserList">查询</el-button>
        </el-col>-->
        <el-col class="add" :xs="8" :md="8">
          <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="userList" stripe border>
        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="username" label="用户名" width="200"></el-table-column>
        <el-table-column align="center" prop="createdAt" label="创建时间">
          <template v-slot:default="slotProps">{{slotProps.row.createdAt | formateDate}}</template>
        </el-table-column>
        <el-table-column align="center" prop="updatedAt" label="更新时间">
          <template v-slot:default="slotProps">{{slotProps.row.updatedAt | formateDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
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
          v-if="userList"
          :total="userList.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="pageSize"
          @size-change="sizeChange"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加/修改用户对话框区域 -->
    <el-dialog
      :title="isUpdate ? '修改用户' : '添加用户'"
      :visible.sync="isShowDialog"
      @close="dialogClose"
    >
      <el-form ref="form" :model="addUserForm" :rules="addUserRules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="roles">
          <el-select multiple v-model="addUserForm.roles">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户权限">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-tree
            :data="permission"
            show-checkbox
            default-expand-all
            node-key="_id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            @check-change="handleCheckChange"
          ></el-tree>
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
import { formateDate } from "@/utils/dateUtils";
import { merge } from "@/utils/tools";
import { addUser, updateUser, delUser } from "api/user";
export default {
  data() {
    return {
      loading: true,
      addUserForm: {
        username: "",
        password: "",
        roles: [],
        permission: []
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        roles: [{ required: true, message: "请选择角色", trigger: "blur" }]
      },
      pageSize: [5, 10, 15, 20],
      searchQuery: { limit: 10, page: 1, where: { username: { $regex: "" } } },
      isShowDialog: false,
      isUpdate: false,
      checkAll: false,
      defaultProps: {
        label: "message"
      },
      permission: []
    };
  },
  computed: {
    ...mapState({
      userList: state => state.adminUser.adminUserList,
      user: state => state.adminUser.adminUser,
      roleList: state => state.adminUser.roleList
    })
  },
  filters: {
    formateDate
  },

  created() {
    this.getUserList();
    if (!this.roleList) this.$store.dispatch("getRoleList", {});
  },
  watch: {
    user() {
      console.log('watch')
      this.mergePermission();
    }
  },
  methods: {
    /**
     * 获取用户列表
     */
    getUserList() {
      this.$store.dispatch("getUserList", this.searchQuery).then(() => {
        this.loading = false;
      });
    },

    /**
     * 合并用户权限
     */
    mergePermission() {
      const { permission, roles } = this.user;
      this.permission = roles.reduce((pre, item) => {
        return merge(pre, item.permission);
      }, permission);
      console.log(this.permission)
    },

    /**
     * 打开添加用户对话框
     */
    openAddUserDialog() {
      if (this.addUserForm._id) delete this.addUserForm._id;
      this.isUpdate = false;
      this.isShowDialog = true;
    },

    /**
     * 每页/条改变时触发
     */
    sizeChange(size) {
      this.searchQuery.limit = size;
      this.getUserList();
    },

    /**
     * 页码改变时触发
     */
    pageChange(page) {
      this.searchQuery.page = page;
      this.getUserList();
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
    addOrUpdateUser() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.isUpdate) {
            // 添加
            // console.log(this.addUserForm);
            await addUser(this.addUserForm);
          } else {
            // console.log(this.addUserForm);
            // 修改
            if (this.addUserForm._id === this.user._id) {
              this.$message({
                type: "error",
                message: "不能修改当前登录用户!"
              });
              return;
            }
            await updateUser(this.addUserForm);
          }
          this.$message({
            message: `${this.isUpdate ? "修改成功!" : "添加成功!"}`,
            type: "success"
          });
          this.$store.dispatch("getUserList", this.searchQuery);
          this.isShowDialog = false;
        }
      });
    },
    /**
     * 对话框关闭后清空表单
     */
    dialogClose() {
      this.$refs.form.resetFields();
      this.addUserForm.permission = [];
      this.$refs.tree.setCheckedKeys([], true);
    },
    /**
     * 点击修改按钮: 修改用户
     */
    updateUser(user) {
      this.isUpdate = true;
      this.isShowDialog = true;
      const { username, _id, roles, permission } = user;
      // 在对话框的生命周期之后再赋值, 这样子就可以保证初始值一定是空值
      this.$nextTick(() => {
        this.addUserForm._id = _id;
        roles.forEach(role => {
          this.addUserForm.roles.push(role._id);
        });
        this.addUserForm.username = username;
        permission.forEach(item => {
          this.addUserForm.permission.push(item._id);
        });
        if (this.addUserForm.permission.length === this.permission.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
        this.$refs.tree.setCheckedKeys(this.addUserForm.permission, true);
      });
    },
    delUser(user) {
      if (user._id === this.user._id) {
        this.$message({
          type: "error",
          message: "不能删除当前登录用户!"
        });
        return;
      }
      this.$confirm("确定删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await delUser(user);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$store.dispatch("getUserList", this.searchQuery);
        })
        .catch(() => {});
    },

    clearSearch() {
      this.getUserList();
    },
    /**
     * 权限选项改变时的回调函数
     */
    handleCheckChange() {
      this.addUserForm.permission = [];
      const checked = this.$refs.tree.getCheckedNodes();
      checked.forEach(item => {
        this.addUserForm.permission.push(item._id);
      });
      if (this.addUserForm.permission.length === this.permission.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    /**
     * 控制全选
     */
    handleCheckAllChange() {
      if (this.checkAll) {
        this.$refs.tree.setCheckedNodes(this.permission);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    }
  }
};
</script>
