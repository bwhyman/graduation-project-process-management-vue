import type { User, Student } from '@/types/type'
import * as XLSX from 'xlsx'

// 读取学生表格
export function readStudentFile(file: Blob) {
  return new Promise<User[]>((resolve) => {
    const reader = new FileReader()
    const students: User[] = []
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result
      const wb = XLSX.read(data, { type: 'binary' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      XLSX.utils.sheet_to_json(sheet).forEach((r: any) => {
        students.push({ name: r['姓名'], number: r['账号'].toString() })
      })
    }
    reader.onloadend = () => {
      resolve(students)
    }
    reader.readAsBinaryString(file)
  })
}

// 读取教师表格
export function readTeacherFile(file: Blob) {
  return new Promise<User[]>((resolve) => {
    const reader = new FileReader()
    const teachers: User[] = []
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result
      const wb = XLSX.read(data, { type: 'binary' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      XLSX.utils.sheet_to_json(sheet).forEach((r: any) => {
        teachers.push({
          number: r['账号'].toString(),
          name: r['姓名'],
          teacher: { total: r['数量'], count: 0 },
          groupNumber: r['组']
        })
      })
    }
    reader.onloadend = () => {
      resolve(teachers)
    }
    reader.readAsBinaryString(file)
  })
}

// 读取题目
export function readProjectTitles(file: Blob) {
  return new Promise<User[]>((resolve) => {
    const reader = new FileReader()
    const projects: Student[] = []
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result
      const wb = XLSX.read(data, { type: 'binary' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      XLSX.utils.sheet_to_json(sheet).forEach((r: any) => {
        projects.push({ number: r['账号'].toString(), projectTitle: r['题目'] })
      })
    }
    reader.onloadend = () => {
      resolve(projects)
    }
    reader.readAsBinaryString(file)
  })
}

// 导出表格
export function exportExcelFile(array: any[], sheetName = 'students', fileName = '学生表格.xlsx') {
  const jsonWorkSheet = XLSX.utils.json_to_sheet(array)
  const workBook: XLSX.WorkBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet
    }
  }
  return XLSX.writeFile(workBook, fileName)
}
