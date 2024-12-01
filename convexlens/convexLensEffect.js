/** @typedef {{x: number, y: number, radius: number}} lensConfigType */
/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement} img
 * @param {lensConfigType} lensConfig
 */
export default async function convexLensEffect(canvas, img, lensConfig) {
  // lensConfig에서 렌즈 중심 좌표와 반지름 가져오기
  const { x: lensX, y: lensY, radius: lensRadius } = lensConfig;

  // 캔버스의 2D 컨텍스트 가져오기
  const ctx = canvas.getContext('2d', { willReadFrequently: true});

  // 캔버스의 너비와 높이 설정
  const width = canvas.width;
  const height = canvas.height;

  // 캔버스에 이미지를 그림 (캔버스 전체 크기로 이미지 채우기)
  ctx.drawImage(img, 0, 0, width, height);

  // 현재 캔버스의 픽셀 데이터를 가져옴 (원본 이미지 데이터)
  const originalData = ctx.getImageData(0, 0, width, height);

  // 렌즈 효과를 적용할 새로운 이미지 데이터를 생성
  const outputData = ctx.createImageData(originalData);

  // 캔버스의 모든 픽셀에 대해 반복
  for (let py = 0; py < height; py++) {
    // y좌표를 순회
    for (let px = 0; px < width; px++) {
      // x좌표를 순회
      // 현재 픽셀(px, py)과 렌즈 중심(lensX, lensY) 사이의 거리 계산
      const dx = px - lensX;
      const dy = py - lensY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 렌즈 내부의 픽셀인지 확인 (렌즈 중심에서 반지름 안쪽인지)
      if (distance < lensRadius) {
        // 렌즈 내부라면 변형 강도(factor) 계산
        // 렌즈 가장자리에서는 약하게, 중심으로 갈수록 강하게
        const factor = Math.pow((lensRadius - distance) / lensRadius, 2);

        // 원본 이미지에서 샘플링할 좌표 계산 (렌즈 효과에 따라 이동된 좌표)
        const sourceX = Math.round(lensX + dx * (1 - factor));
        const sourceY = Math.round(lensY + dy * (1 - factor));

        // 샘플링 좌표가 이미지 범위 내에 있는지 확인
        if (
          sourceX >= 0 &&
          sourceX < width &&
          sourceY >= 0 &&
          sourceY < height
        ) {
          // 원본 데이터에서 샘플링 픽셀의 색상 데이터 가져오기
          const srcIdx = (sourceY * width + sourceX) * 4; // RGBA 값 시작 인덱스
          const destIdx = (py * width + px) * 4; // 변형 후 픽셀의 RGBA 값 시작 인덱스

          // 색상 데이터를 출력 이미지 데이터에 복사
          outputData.data[destIdx] = originalData.data[srcIdx]; // R 값
          outputData.data[destIdx + 1] = originalData.data[srcIdx + 1]; // G 값
          outputData.data[destIdx + 2] = originalData.data[srcIdx + 2]; // B 값
          outputData.data[destIdx + 3] = originalData.data[srcIdx + 3]; // A 값
        }
      } else {
        // 렌즈 외부라면 원본 픽셀 데이터를 그대로 복사
        const srcIdx = (py * width + px) * 4;
        const destIdx = srcIdx;

        outputData.data[destIdx] = originalData.data[srcIdx];
        outputData.data[destIdx + 1] = originalData.data[srcIdx + 1];
        outputData.data[destIdx + 2] = originalData.data[srcIdx + 2];
        outputData.data[destIdx + 3] = originalData.data[srcIdx + 3];
      }
    }
  }

  // 변형된 픽셀 데이터를 캔버스에 다시 그리기
  ctx.putImageData(outputData, 0, 0);
}
