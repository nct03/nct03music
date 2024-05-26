import { BasicIP } from "../constant/Constants";
import { checkToken } from "./About";

export const getAllPlaylistAlbum = async () => {
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
        console.log(err)
    }
}

export const deletePlaylistAlbum = async (id) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/playlists/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.errors[0]);
        }
    } catch (err) {
        console.log(err)
    }
}

export const createPlayListAlbum = async (name) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        })
        const data = await response.json()
        return data
    } catch (err) {
        console.error(err)
    }
}

export const getFavoriteSongs = async () => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/users/me/favorite-songs?pageNum=1&pageSize=20`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.json()
        return data
    } catch (err) {
        console.error(err)
    }
}

export const getSongsInPlaylist = async (id) => {
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
    } catch (err) {
        console.error(err)
    }
}

export const getSongsOfArtist = async (id) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/artists/${id}/songs`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.json()
        return data
    } catch (err) {
        console.error(err)
    }
}

export const getSongsOfGenre = async (id) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/genres/${id}/songs`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.json()
        return data
    } catch (err) {
        console.error(err)
    }
}

export const addSongToPlaylist = async (id) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/playlists/${id}/songs`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.json()
        return data
    } catch (err) {
        console.log(err)
    }
}

export const removeSongInPlaylist = async (id) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/users/unlike/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.json()
        return data
    } catch (err) {
        console.log(err)
    }
}

export const addFavoriteSong = async (id) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/users/like/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.errors[0]);
        }

    } catch (error) {
        throw new Error(error.message || 'Failed to add the song to your favorites');
    }
};

export const removeFavoriteSong = async (id) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/users/unlike/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.errors[0]);
        }

    } catch (error) {
        throw new Error(error.message || 'Failed to remove song from favorites');
    }
};


export const checkFavoriteStatus = async (id) => {
    try {
        const token = await checkToken();
        const response = await fetch(`${BasicIP}/users/favorite-songs/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const result = await response.json();
        return result === true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
