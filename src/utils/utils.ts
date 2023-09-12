import BN from 'bn.js'

export function i32ToBytes(num: number) {
  const arr = new ArrayBuffer(4)
  const view = new DataView(arr)
  view.setInt32(0, num, false)
  return new Uint8Array(arr)
}

export function leadingZeros(bitNum: number, data: BN) {
  let i = 0
  for (let j = bitNum - 1; j >= 0; j--) {
    if (!data.testn(j)) {
      i++
    } else {
      break
    }
  }
  return i
}

export function trailingZeros(bitNum: number, data: BN) {
  let i = 0
  for (let j = 0; j < bitNum; j++) {
    if (!data.testn(j)) {
      i++
    } else {
      break
    }
  }
  return i
}

export function isZero(bitNum: number, data: BN) {
  for (let i = 0; i < bitNum; i++) {
    if (data.testn(i)) return false
  }
  return true
}

export function mostSignificantBit(bitNum: number, data: BN) {
  if (isZero(bitNum, data)) return null
  else return leadingZeros(bitNum, data)
}

export function leastSignificantBit(bitNum: number, data: BN) {
  if (isZero(bitNum, data)) return null
  else return trailingZeros(bitNum, data)
}
