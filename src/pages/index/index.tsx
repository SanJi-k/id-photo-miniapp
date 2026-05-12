import { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { Button, Image, Text, View } from '@tarojs/components'
import { BACKGROUND_COLORS, PHOTO_SIZES } from '@/constants/photo'
import { removeBackgroundApi } from '@/services/photo'
import type {
  BackgroundColorId,
  PhotoSizeId,
  ProcessStatus,
  UploadedPhoto
} from '@/types/photo'
import './index.scss'

export default function Index() {
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedPhoto | null>(null)
  const [processedPhotoPath, setProcessedPhotoPath] = useState('')
  const [status, setStatus] = useState<ProcessStatus>('idle')
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<BackgroundColorId>('blue')
  const [selectedSizeId, setSelectedSizeId] = useState<PhotoSizeId>('one-inch')

  const selectedBackground = useMemo(
    () => BACKGROUND_COLORS.find((item) => item.id === selectedBackgroundId) ?? BACKGROUND_COLORS[0],
    [selectedBackgroundId]
  )

  const selectedSize = useMemo(
    () => PHOTO_SIZES.find((item) => item.id === selectedSizeId) ?? PHOTO_SIZES[0],
    [selectedSizeId]
  )

  const hasResult = Boolean(processedPhotoPath)
  const isProcessing = status === 'uploading' || status === 'processing'

  // 选择照片后立即进入预留抠图流程
  async function handleChoosePhoto() {
    try {
      setStatus('uploading')
      const result = await Taro.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      })

      const imagePath = result.tempFilePaths[0]
      setUploadedPhoto({ path: imagePath })
      setStatus('processing')

      const processedResult = await removeBackgroundApi({ imagePath })
      setProcessedPhotoPath(processedResult.imagePath)
      setStatus('success')
    } catch (error) {
      setStatus('idle')
      Taro.showToast({
        title: '未选择照片',
        icon: 'none'
      })
    }
  }

  // 保存处理后的证件照到系统相册
  async function handleDownloadPhoto() {
    if (!processedPhotoPath) {
      Taro.showToast({
        title: '请先上传照片',
        icon: 'none'
      })
      return
    }

    try {
      await Taro.saveImageToPhotosAlbum({
        filePath: processedPhotoPath
      })
      Taro.showToast({
        title: '已保存到相册',
        icon: 'success'
      })
    } catch (error) {
      Taro.showToast({
        title: '保存失败，请检查权限',
        icon: 'none'
      })
    }
  }

  // 重新开始时清空图片与处理状态
  function handleReset() {
    setUploadedPhoto(null)
    setProcessedPhotoPath('')
    setStatus('idle')
  }

  return (
    <View className='page'>
      {/* 顶部标题模块 */}
      <View className='hero'>
        <Text className='hero__eyebrow'>高清无水印下载</Text>
        <Text className='hero__title'>一键生成标准证件照</Text>
        <Text className='hero__subtitle'>上传照片后自动抠图，可快速切换红底、蓝底、白底与常用尺寸。</Text>
      </View>

      {/* 上传照片模块 */}
      <View className='upload-panel'>
        <Button className='upload-button' loading={isProcessing} disabled={isProcessing} onClick={handleChoosePhoto}>
          {hasResult ? '重新上传照片' : '上传照片'}
        </Button>
        <Text className='upload-panel__tip'>支持从相册选择或直接拍摄，首版先接入预留抠图接口。</Text>
      </View>

      {/* 自动抠图状态模块 */}
      {status !== 'idle' && (
        <View className='status-panel'>
          <View className={`status-dot status-dot--${status}`} />
          <Text className='status-panel__text'>
            {status === 'uploading' && '正在读取照片...'}
            {status === 'processing' && '正在自动抠图...'}
            {status === 'success' && '抠图完成，可选择背景色和尺寸'}
            {status === 'error' && '处理失败，请重新上传'}
          </Text>
        </View>
      )}

      {/* 预览模块 */}
      <View className='preview-section'>
        <View className='preview-card'>
          <View
            className='photo-preview'
            style={{
              backgroundColor: selectedBackground.value,
              aspectRatio: `${selectedSize.width} / ${selectedSize.height}`
            }}
          >
            {hasResult ? (
              <Image className='photo-preview__image' src={processedPhotoPath} mode='aspectFit' />
            ) : (
              <View className='photo-preview__empty'>
                <Text className='photo-preview__empty-title'>等待上传</Text>
                <Text className='photo-preview__empty-desc'>证件照预览将在这里显示</Text>
              </View>
            )}
          </View>
          <View className='preview-card__meta'>
            <Text className='preview-card__name'>{selectedSize.name}</Text>
            <Text className='preview-card__size'>
              {selectedSize.width} x {selectedSize.height}{selectedSize.unit}
            </Text>
          </View>
        </View>
      </View>

      {/* 背景色选择模块 */}
      <View className='option-section'>
        <Text className='section-title'>背景色</Text>
        <View className='color-list'>
          {BACKGROUND_COLORS.map((item) => (
            <Button
              key={item.id}
              className={`color-option ${selectedBackgroundId === item.id ? 'color-option--active' : ''}`}
              onClick={() => setSelectedBackgroundId(item.id)}
            >
              <View className='color-option__swatch' style={{ backgroundColor: item.value }} />
              <Text className='color-option__name'>{item.name}</Text>
            </Button>
          ))}
        </View>
      </View>

      {/* 尺寸选择模块 */}
      <View className='option-section'>
        <Text className='section-title'>证件照尺寸</Text>
        <View className='size-list'>
          {PHOTO_SIZES.map((item) => (
            <Button
              key={item.id}
              className={`size-option ${selectedSizeId === item.id ? 'size-option--active' : ''}`}
              onClick={() => setSelectedSizeId(item.id)}
            >
              <Text className='size-option__name'>{item.name}</Text>
              <Text className='size-option__desc'>{item.description}</Text>
              <Text className='size-option__spec'>
                {item.width} x {item.height}{item.unit}
              </Text>
            </Button>
          ))}
        </View>
      </View>

      {/* 下载操作模块 */}
      <View className='action-bar'>
        {uploadedPhoto && (
          <Button className='secondary-button' onClick={handleReset}>
            清空
          </Button>
        )}
        <Button className='primary-button' disabled={!hasResult} onClick={handleDownloadPhoto}>
          下载无水印证件照
        </Button>
      </View>
    </View>
  )
}
