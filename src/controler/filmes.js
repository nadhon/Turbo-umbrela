// stores/filmes.js
import { defineStore } from 'pinia'

export const useFilmesStore = defineStore('filmes', {
  state: () => ({
    filmes: [],
    favoritosIds: [],
    bannerFilm: null,
    filmeSelecionado: null,
    // opcional: progresso de visualização
    watchProgress: {}
  }),
  actions: {
    initMockIfEmpty() {
      const mockFilmes = [
        { id: 1, title: "Elephants Dream", description: "Uma experiência surrealista em um mundo mecânico e misterioso.", img: "https://via.placeholder.com/800x400", video: "https://www.w3schools.com/html/mov_bbb.mp4", previewUrl: "https://www.w3schools.com/html/mov_bbb.mp4", categoria: "Ação" },
        { id: 2, title: "Noite Cômica", description: "Uma comédia leve", img: "https://via.placeholder.com/800x400", video: "https://www.w3schools.com/html/movie.mp4", previewUrl: "https://www.w3schools.com/html/movie.mp4", categoria: "Humor" },
        { id: 3, title: "Pesadelo Urbano", description: "Terror psicológico", img: "https://via.placeholder.com/800x400", previewUrl: "", categoria: "Terror" },
        { id: 4, title: "Guerra de Titãs", description: "Ação épica e brutal", img: "https://via.placeholder.com/800x400", previewUrl: "", categoria: "Ação" },
        { id: 5, title: "Piadas do Caos", description: "Humor nonsense", img: "https://via.placeholder.com/800x400", previewUrl: "", categoria: "Humor" },
      ]
      const saved = JSON.parse(localStorage.getItem('filmes'))
      this.filmes = saved && saved.length ? saved : mockFilmes
      this.favoritosIds = JSON.parse(localStorage.getItem('favoritosIds')) || []
      this.bannerFilm = this.filmes[0] || null
      localStorage.setItem('filmes', JSON.stringify(this.filmes))
    },
    toggleFavoritoById(id) {
      if (this.favoritosIds.includes(id)) {
        this.favoritosIds = this.favoritosIds.filter(x => x !== id)
      } else {
        this.favoritosIds.push(id)
      }
      localStorage.setItem('favoritosIds', JSON.stringify(this.favoritosIds))
    },
    setFilmeSelecionado(filme) {
      this.filmeSelecionado = filme
      localStorage.setItem('filmeSelecionado', JSON.stringify(filme))
    },
    setBannerById(id) {
      const f = this.filmes.find(x => x.id === id)
      if (f) this.bannerFilm = f
    },
    saveFilmesToLocal() {
      localStorage.setItem('filmes', JSON.stringify(this.filmes))
    },
  },
})
