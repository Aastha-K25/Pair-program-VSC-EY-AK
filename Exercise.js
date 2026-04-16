const baseUrl = "http://localhost:5241/api/music";

Vue.createApp({
    data() {
        return {
            musicList: [],
            TitleToSearch: '',
            artistToSearch: '',
            singleMusic: null,
            idToGet: null,

            idMessage: "",
            searchMessage: "",

            addData: {
                title: '',
                artist: '',
                duration: null,
                publicationYear: null
            },
            addMessage: '',
            addError: '',

            deleteId: null,
            deleteMessage: '',
            deleteError: '',

            updateData: {
                id: null,
                title: '',
                artist: '',
                duration: null,
                publicationYear: null
            },
            updateMessage: '',
            updateError: ''
        }
    },

    methods: {

        // GET ALL
        getAllMusic() {
            this.getMusic(baseUrl)
        },

        // SEARCH
        searchMusic() {
            const url = baseUrl + "/search?title=" + this.TitleToSearch + "&artist=" + this.artistToSearch;
            this.getMusic(url)

            if (!this.TitleToSearch && !this.artistToSearch) {
                this.searchMessage = "Write something to search"
                return
            }

            this.searchMessage = ""
        },

        // GENERIC GET
        async getMusic(url) {
            try {
                const response = await axios.get(url)
                this.musicList = response.data
            }
            catch (ex) {
                this.searchMessage = "Error searching for the music"
            }
        },

        // GET BY ID
        async getById() {
            if (!this.idToGet || this.idToGet <= 0) {
                this.idMessage = "Please enter a valid id"
                return
            }

            this.idMessage = ""

            try {
                const response = await axios.get(baseUrl + "/" + this.idToGet)
                this.singleMusic = response.data
            }
            catch (ex) {
                this.singleMusic = null
                this.idMessage = "Music not found"
            }
        },

        // DELETE
        async deleteMusic(id) {
            if (!id || id <= 0) {
                this.deleteError = "Please enter a valid id"
                return
            }

            this.deleteError = ""

            try {
                await axios.delete(baseUrl + "/" + id)
                this.deleteMessage = "Deleted music with id " + id
                this.getAllMusic()
            }
            catch (ex) {
                this.deleteError = "Error deleting music"
            }
        },

        // ADD
        async addMusic() {
            if (!this.addData.title || !this.addData.artist) {
                this.addError = "Please fill all fields"
                return
            }

            this.addError = ""

            try {
                const response = await axios.post(baseUrl, this.addData)
                this.addMessage = "Added id " + response.data.id
                this.getAllMusic()
            }
            catch (ex) {
                this.addError = "Error adding music"
            }
        },

        // UPDATE
        async updateMusic() {
            if (!this.updateData.id || this.updateData.id <= 0) {
                this.updateError = "Please enter a valid id"
                return
            }

            this.updateError = ""

            try {
                const url = baseUrl + "/" + this.updateData.id
                const response = await axios.put(url, this.updateData)

                this.updateMessage = "Updated successfully"
                this.getAllMusic()
            }
            catch (ex) {
                this.updateError = "Error updating music"
            }
        }

    }

}).mount('#app');