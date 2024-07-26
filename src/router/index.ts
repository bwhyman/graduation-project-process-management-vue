import { CommonService } from '@/services'
import * as consty from '@/services/Const'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/IndexView.vue')
  },
  {
    path: '/',
    component: () => import('@/views/main/IndexView.vue'),
    meta: {
      roles: [consty.STUDENT, consty.TEACHER, consty.ADMIN]
    },
    children: [
      {
        path: 'settings',
        component: () => import('@/views/main/header/UserSettingView.vue')
      },
      {
        path: 'admin',
        component: () => import('@/views/main/admin/IndexView.vue'),
        meta: {
          roles: [consty.ADMIN]
        }
      },
      {
        path: 'processfiles/:pid?',
        component: () => import('@/views/main/teacher/functions/ListFilesView.vue'),
        meta: {
          roles: [consty.TEACHER]
        }
      },
      {
        path: 'student',
        component: () => import('@/views/main/student/IndexView.vue'),
        meta: {
          roles: [consty.STUDENT]
        },
        children: [
          {
            path: '',
            component: () => import('@/views/main/student/TutorView.vue')
          },
          {
            props: true,
            path: 'processes/:pid',
            component: () => import('@/views/main/student/ProcessView.vue')
          }
        ]
      },
      {
        path: 'teacher',
        component: () => import('@/views/main/teacher/IndexView.vue'),
        meta: {
          roles: [consty.TEACHER]
        },
        children: [
          {
            path: '',
            component: () => import('@/views/main/teacher/TutorStudentsView.vue')
          },
          {
            path: 'scores',
            component: () => import('@/views/main/teacher/GroupScoringsView.vue')
          },
          {
            path: 'functions',
            component: () => import('@/views/main/teacher/functions/IndexView.vue')
          },
          {
            path: 'processes/:pid/types/:auth',
            component: () => import('@/views/main/teacher/ProcessView.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach((to) => {
  // 排除，没有声明角色权限的路由
  if (!to.meta.roles) {
    return true
  }

  const role = to.meta.roles.find((r) => r == CommonService.getRole())
  if (role) {
    return true
  }
  sessionStorage.clear()
  return '/login'
})

export default router
