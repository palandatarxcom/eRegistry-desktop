<template>
    <el-dialog width="500px"
            title="申请数据变更"
            :visible.sync="dialogVisible"
            :before-close="cancel">
        <el-form :model="audit" :rules="rules" label-width="70px" ref="auditForm">
            <el-form-item label="原因" prop="opinion">
                <el-input type="textarea" v-model="audit.opinion"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" :disabled="isSaving" @click="confirm('auditForm')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import { changeAudit } from '@/api/AuditService'
  export default {
    name: 'ApplyDataChangeDialog',
    props: {
      dialogVisible: {
        type: Boolean
      },
      audit: {
        type: Object
      }
    },
    data() {
      return {
        rules: {
          opinion: [
            { required: true, message: '请填写数据变更原因', trigger: 'change' }
          ]
        },
        isSaving: false
      }
    },
    methods: {
      handleClose(type, audit) {
        this.$emit('closeDialog', { page: 'applyDataChange', type, audit })
      },
      cancel() {
        this.handleClose('cancel')
      },
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isSaving = true
            changeAudit(this.audit).then(res => {
              this.isSaving = false
              this.handleClose('confirm', res.data)
            }, () => {
              this.isSaving = false
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
