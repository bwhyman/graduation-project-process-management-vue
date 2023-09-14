<script setup lang="ts">
import StartTimeView from './StartTimeView.vue'
import StudentExcelView from './StudentExcelView.vue'
import TeacherExcelView from './TeacherExcelView.vue'
import ProjectExcelView from './ProjectExcelView.vue'
import ResetPasswordView from './ResetPasswordView.vue'
import groupingView from './GroupingView.vue'
import AddProcessView from './AddProcessView.vue'
import ResetDataView from './ResetDataView.vue'
import StudentSelectionView from './StudentSelectionView.vue'
</script>
<template>
  <!-- start time, reset password -->
  <el-row class="my-row">
    <el-col :span="12">
      <StartTimeView />
    </el-col>
    <el-col :span="12">
      <ResetPasswordView />
    </el-col>
  </el-row>

  <!-- read student excel -->
  <el-row class="my-row">
    <el-col :span="12">
      <StudentExcelView />
    </el-col>
    <!-- read teacher excel -->
    <el-col :span="12">
      <TeacherExcelView />
    </el-col>
  </el-row>

  <!-- read project excel -->
  <el-row class="my-row">
    <el-col :span="12">
      <ProjectExcelView />
    </el-col>
    <el-col :span="12">
      <ResetDataView />
    </el-col>
  </el-row>
  <!-- 分组 -->
  <el-row class="my-row">
    <el-col :span="12">
      <groupingView />
    </el-col>
    <el-col :span="12">
      <AddProcessView />
    </el-col>
  </el-row>
  <el-row class="my-row">
    <el-col :span="24">
      <StudentSelectionView />
    </el-col>
  </el-row>
</template>
