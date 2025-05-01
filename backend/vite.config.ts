export default defineConfig({
	server: {
		cors: {
			origin: ['https://backend-production-a427.up.railway.app', 'http://localhost:5173'],
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type']
		},
		allowedHosts: ['backend-production-a427.up.railway.app']
	}
});
