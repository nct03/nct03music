import { Song } from '../models'

export function findPreviousSong(songList: Song[], currentSong: Song): Song {
  const currentIndex = songList.findIndex((song) => song.id === currentSong.id)
  if (currentIndex === -1) {
    return currentSong // Trả về bài hát hiện tại nếu không tìm thấy trong danh sách
  }

  const previousIndex = (currentIndex - 1 + songList.length) % songList.length // Lấy chỉ số của bài hát trước đó
  return songList[previousIndex]
}

export function findNextSong(songList: Song[], currentSong: Song): Song {
  const currentIndex = songList.findIndex((song) => song.id === currentSong.id)
  if (currentIndex === -1) {
    return currentSong // Trả về bài hát hiện tại nếu không tìm thấy trong danh sách
  }

  const nextIndex = (currentIndex + 1) % songList.length // Lấy chỉ số của bài hát kế tiếp
  return songList[nextIndex]
}

export function findSongIndex(songList: Song[], songToFind: Song): number {
  return songList.findIndex((song) => song.id === songToFind.id)
}

export function shuffleSongs(songList: Song[]): Song[] {
  // Tạo một bản sao của danh sách bài hát để không ảnh hưởng đến danh sách gốc
  const shuffledList = [...songList]

  // Trộn danh sách bài hát
  for (let i = shuffledList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]]
  }

  // Trả về danh sách id bài hát đã bị xáo trộn
  return shuffledList
}
