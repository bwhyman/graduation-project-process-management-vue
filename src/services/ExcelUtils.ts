import type { User, Student, ProcessScore, ProcessItem, Process, PSDetail } from '@/types/type'
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
          teacher: { total: r['数量'], A: r['A组'], C: r['C组'] },
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

// 导出互选表格
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

// 导出分组表格
export const exportGroupExcelFile = (
  map: Map<number, { students: Student[]; teachers: User[] }>
) => {
  const workBook = XLSX.utils.book_new()

  map.forEach((value, key) => {
    const students = value.students.map((stu) => {
      return {
        序号: stu.queueNumber,
        学号: stu.number,
        姓名: stu.name,
        指导教师: stu.teacherName,
        毕设题目: stu.projectTitle
      }
    })
    const jsonWorkSheet = XLSX.utils.json_to_sheet(students)
    XLSX.utils.book_append_sheet(workBook, jsonWorkSheet, `第${key}组`)
  })

  return XLSX.writeFile(workBook, '学生分组表格.xlsx')
}

// 导出评分表格
export const exportScoreExcelFile = (
  processes: Process[],
  processScores: ProcessScore[],
  students: Student[]
) => {
  let index = 0
  const rows = students.map((stu) => {
    const row: any = {}
    row['序号'] = index += 1
    row['学号'] = stu.number
    row['姓名'] = stu.name
    row['指导教师'] = stu.teacherName
    row['毕设题目'] = stu.projectTitle

    processes.forEach((p) => {
      const processScoresT = processScores.filter(
        (ps) => p.id == ps.processId && ps.studentId == stu.id
      )
      // 计算过程项分数
      const scoreDetailMap = new Map<number, number>()
      processScoresT.forEach((ps) => {
        const detail = ps.detail as PSDetail
        detail.detail?.forEach((teacherScoreDetail) => {
          let detailScore = scoreDetailMap.get(teacherScoreDetail.number) ?? 0
          detailScore += teacherScoreDetail.score
          scoreDetailMap.set(teacherScoreDetail.number, detailScore)
        })
      })
      ;((p.items as ProcessItem[]) ?? []).forEach((item) => {
        row[`${item.name}(${item.point})`] =
          ~~((scoreDetailMap.get(item.number!)! / processScoresT.length) * 100) / 100
      })

      // 过程平均分
      let temp = 0
      scoreDetailMap.forEach((value) => {
        temp += value
      })

      row[`${p.name}`] = ~~((temp / processScoresT.length) * 100) / 100
    })

    return row
  })
  const workBook = XLSX.utils.book_new()
  const jsonWorkSheet = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(workBook, jsonWorkSheet, `成绩`)
  return XLSX.writeFile(workBook, '学生详细成绩表格.xlsx')
}

// 读取带评分的学生表格
export function readStudentForSelectionFile(file: Blob) {
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
