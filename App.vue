const { createApp } = Vue

createApp({
    methods: {
        goto(page) {
            this.currentPage = page
        }
    }
})