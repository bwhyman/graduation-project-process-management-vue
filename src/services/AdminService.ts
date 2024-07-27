import axios from '@/axios'
import { useDepartmentStore } from '@/stores/DepartmentStore'
import type { Department, ResultVO, User } from '@/types'
import { StoreCache } from './Decorators'

const ADMIN = 'admin'

const departmentStore = useDepartmentStore()

export class AdminService {
  static addTeachers = async (teachers: User[], depid: string) => {
    teachers.forEach((t) => {
      // @ts-ignore
      t.teacher = JSON.stringify(t.teacher)
    })
    await axios.post(`${ADMIN}/teachers/${depid}`, teachers)
  }

  @StoreCache(departmentStore.departmentsS)
  static async listDepartmentsService() {
    const resp = await axios.get<ResultVO<{ departments: Department[] }>>(`${ADMIN}/departments`)
    return resp.data.data?.departments as unknown as Ref<Department[]>
  }

  //
  @StoreCache(departmentStore.departmentsS, true)
  static async addDepartmentService(name: string) {
    const resp = await axios.post<ResultVO<{ departments: Department[] }>>(`${ADMIN}/departments`, {
      name
    })
    return resp.data.data?.departments as unknown as Ref<Department[]>
  }

  //
  @StoreCache(departmentStore.departmentsS, true)
  static async delDepartmentService(did: string) {
    const resp = await axios.delete<ResultVO<{ departments: Department[] }>>(
      `${ADMIN}/departments/${did}`
    )
    return resp.data.data?.departments as unknown as Ref<Department[]>
  }
}
