import type { RemoveBackgroundRequest, RemoveBackgroundResponse } from '@/types/photo'

// 预留自动抠图接口，后续可替换为后端服务或云函数调用
export async function removeBackgroundApi(
  params: RemoveBackgroundRequest
): Promise<RemoveBackgroundResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    imagePath: params.imagePath,
    status: 'success'
  }
}
