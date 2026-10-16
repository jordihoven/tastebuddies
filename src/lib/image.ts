// Downscale an image File client-side before upload.
// Supabase image transforms aren't enabled on this project (render endpoint 403s),
// so we shrink the file ourselves to keep the grids fast.
export async function downscaleImage(file: File, maxDim = 1200, quality = 0.8): Promise<File> {
  try {
    if (!file.type.startsWith('image/')) return file

    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))

    // already small enough — ship as-is
    if (scale === 1 && file.size < 300_000) {
      bitmap.close()
      return file
    }

    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (!blob) return file

    // ponytail: always re-encode to JPEG; loses transparency + animation, fine for food photos
    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], name, { type: 'image/jpeg' })
  } catch (err) {
    console.error('downscaleImage failed, uploading original:', err)
    return file
  }
}
