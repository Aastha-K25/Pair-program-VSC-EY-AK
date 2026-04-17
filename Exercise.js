const baseUrl = "https://restmusicaasthaogeylem.azurewebsites.net/api/Music";

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

        // LOGIN
        async login() {
    try {
        const response = await axios.post("https://restmusicaasthaogeylem.azurewebsites.net/Auth/Login", {})

        localStorage.setItem("token", response.data);
        alert("Du er logget ind!");
    } 
    catch (ex) {
        console.log(ex);
        alert("Login failed");
    }
},

        // CHECK LOGIN
        isLoggedIn() {
            return localStorage.getItem("token") != null;
        },

        // GET CONFIG TOKEN
        getConfig() {
            const token = localStorage.getItem("token");
            return {
                headers: {
                    Authorization: "Bearer " + token
                }
            };
        },

        // GET ALL
        getAllMusic() {
            this.getMusic(baseUrl)
        },

        // SEARCH
        searchMusic() {
            if (!this.TitleToSearch && !this.artistToSearch) {
                this.searchMessage = "Write something to search"
                return
            }

            this.searchMessage = ""

            const url = baseUrl + "/search?title=" + this.TitleToSearch + "&artist=" + this.artistToSearch;
            this.getMusic(url)
        },

        // GENERIC GET
        async getMusic(url) {
            try {
                const response = await axios.get(url)
                this.musicList = response.data || []
            } catch (ex) {
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
            } catch (ex) {
                this.singleMusic = null
                this.idMessage = "Music not found"
            }
        },

        // DELETE
        async deleteMusic(id) {
            if (!this.isLoggedIn()) {
                this.deleteError = "Du skal logge ind først!"
                return
            }

            if (!id || id <= 0) {
                this.deleteError = "Please enter a valid id"
                return
            }

            this.deleteError = ""

            try {
                await axios.delete(baseUrl + "/" + id, this.getConfig())
                this.deleteMessage = "Deleted music with id " + id
                this.getAllMusic()
            } catch (ex) {
                this.deleteError = "Error deleting music"
            }
        },

        // ADD
        async addMusic() {
            if (!this.isLoggedIn()) {
                this.addError = "Du skal logge ind først!"
                return
            }

            if (!this.addData.title || !this.addData.artist) {
                this.addError = "Please fill all fields"
                return
            }

            this.addError = ""

            try {
                const response = await axios.post(baseUrl, this.addData, this.getConfig())
                this.addMessage = "Added id " + response.data.id
                this.getAllMusic()
            } catch (ex) {
                this.addError = "Error adding music"
            }
        },

        // UPDATE
        async updateMusic() {
            if (!this.isLoggedIn()) {
                this.updateError = "Du skal logge ind først!"
                return
            }

            if (!this.updateData.id || this.updateData.id <= 0) {
                this.updateError = "Please enter a valid id"
                return
            }

            this.updateError = ""

            try {
                const url = baseUrl + "/" + this.updateData.id
                await axios.put(url, this.updateData, this.getConfig())

                this.updateMessage = "Updated successfully"
                this.getAllMusic()
            } catch (ex) {
                this.updateError = "Error updating music"
            }
        }

    }

}).mount('#app');