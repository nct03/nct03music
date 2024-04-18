import { BasicIP } from "../constant/Constants";
import { checkToken } from "./About";

export const getAllPlaylistAlbum  = async() => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/users/me/playlists`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        const data = await response.json();
        return data
    } catch (err) {
        throw new Error ()
    }
}

export const deletePlaylistAlbum = async(id)  => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/playlists/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data =  await response.json()
        return data
    } catch (err) {
        throw err
    }
}

export const createPlayListAlbum = async(name) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({name})
        })
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

export const getFavoriteSongs = async() => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/users/me/favorite-songs?pageNum=1&pageSize=7`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.json()
        return data
    } catch (err) {
        throw err
    }
}

export const getSongsInPlaylist = async(id) => {
    try {
        const token = await checkToken(); 
        const response = await fetch(`${BasicIP}/playlists/${id}/songs`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.json()
        return data
    }catch (err) {
        throw err
    }
}