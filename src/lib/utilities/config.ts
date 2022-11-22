import { base } from "$app/paths"

let url
if (base.length > 0) {
  url = `http://${base}`
} else {
  url = `http://localhost:5173`
}

export const server_url = url
