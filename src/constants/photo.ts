import type { BackgroundColorOption, PhotoSizeOption } from '@/types/photo'

export const BACKGROUND_COLORS: BackgroundColorOption[] = [
  {
    id: 'red',
    name: '红底',
    value: '#d61f2c'
  },
  {
    id: 'blue',
    name: '蓝底',
    value: '#1677ff'
  },
  {
    id: 'white',
    name: '白底',
    value: '#ffffff'
  }
]

export const PHOTO_SIZES: PhotoSizeOption[] = [
  {
    id: 'one-inch',
    name: '1寸',
    width: 25,
    height: 35,
    unit: 'mm',
    description: '常用报名、档案、证件照规格'
  },
  {
    id: 'two-inch',
    name: '2寸',
    width: 35,
    height: 49,
    unit: 'mm',
    description: '常用签证、考试、资料提交规格'
  },
  {
    id: 'exam',
    name: '考试照',
    width: 295,
    height: 413,
    unit: 'px',
    description: '预留各类考试报名规格'
  }
]
