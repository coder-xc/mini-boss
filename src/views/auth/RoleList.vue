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
            v-model="searchQuery.where.name.$regex"
            placeholder="请输入角色名"
            clearable
            @clear="clearSearch"
            @keyup.enter.native="getRoleList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-col>
        <el-col class="add" :xs="8" :md="8">
          <el-button type="primary" @click="openAddRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="roleList" stripe border>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="name" label="角色名称" width="200"></el-table-column>
        <el-table-column align="center" prop="description" label="角色备注"></el-table-column>
        <el-table-column align="center" prop="status" label="角色状态" width="200"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openUpdateRoleDialog(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRole(slotProps.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          :total="total"
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
      :title="isUpdate ? '修改角色' : '添加角色'"
      :visible.sync="isShowDialog"
      @close="dialogClose"
    >
      <el-form ref="form" :model="addRoleForm" :rules="addRoleRules" label-width="100px">
        <el-form-item label="角色名字" prop="name">
          <el-input v-model="addRoleForm.name" placeholder="请输入角色名字"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" prop="description">
          <el-input v-model="addRoleForm.description" placeholder="请输入角色备注"></el-input>
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-input v-model="addRoleForm.status" placeholder="请输入角色状态"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
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
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { reqAddRole, reqDelRole } from "api/user";
export default {
  computed: {
    ...mapState({
      roleList: state => state.adminUser.roleList,
      total: state => state.adminUser.roleTotal,
      permission: state => state.adminUser.adminUser.permission
    })
  },
  data() {
    return {
      loading: false,
      checkAll: false,
      addRoleForm: {
        name: "",
        description: "",
        status: "",
        permission: []
      },
      addRoleRules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入角色备注", trigger: "blur" }
        ],
        status: [{ required: true, message: "请输入角色状态", trigger: "blur" }]
      },
      pageSize: [5, 10, 15, 20],
      searchQuery: { limit: 10, page: 1, where: { name: { $regex: "" } } },
      isShowDialog: false,
      isUpdate: false,
      defaultProps: {
        label: "message"
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
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
    clearSearch() {
      this.getRoleList();
    },
    getRoleList() {
      this.$store.dispatch("getRoleList", this.searchQuery);
    },
    /**
     * 打开添加角色对话框
     */
    openAddRoleDialog() {
      this.isUpdate = false;
      this.isShowDialog = true;
      if (this.addRoleForm._id) {
        delete this.addRoleForm._id;
      }
    },

    /**
     * 对话框关闭后清空表单
     */
    dialogClose() {
      this.$refs.form.resetFields();
      this.addRoleForm.permission = [];
      this.$refs.tree.setCheckedKeys([], true);
    },
    /**
     * 关闭对话框
     */
    closeDialog() {
      this.isShowDialog = false;
    },

    /**
     * 权限选项改变时的回调函数
     */
    handleCheckChange() {
      this.addRoleForm.permission = [];
      const checked = this.$refs.tree.getCheckedNodes();
      checked.forEach(item => {
        this.addRoleForm.permission.push(item._id);
      });
      if (this.addRoleForm.permission.length === this.permission.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },

    /**
     * 点击确定按钮: 添加/修改角色
     */
    async addRole() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await reqAddRole(this.addRoleForm);
          this.isShowDialog = false;
          this.$message.success(`${this.isUpdate ? "修改" : "添加"}成功!`);
          this.$store.dispatch("getRoleList", this.searchQuery);
        }
      });
    },

    /**
     * 控制全选
     */
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.$refs.tree.setCheckedNodes(this.permission);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    /**
     * 修改角色
     */
    openUpdateRoleDialog(role) {
      this.isUpdate = true;
      this.isShowDialog = true;
      const { permission, name, description, status, _id } = role;
      this.$nextTick(() => {
        this.addRoleForm._id = _id;
        this.addRoleForm.name = name;
        this.addRoleForm.description = description;
        this.addRoleForm.status = status;
        permission.forEach(item => {
          this.addRoleForm.permission.push(item._id);
        });
        if (this.addRoleForm.permission.length === this.permission.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
        this.$refs.tree.setCheckedKeys(this.addRoleForm.permission, true);
      });
    },
    /**
     * 删除角色
     */
    delRole(role) {
      this.$confirm("确定删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await reqDelRole(role);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$store.dispatch("getRoleList", this.searchQuery);
        })
        .catch(() => {});
    }
  }
};
</script>
