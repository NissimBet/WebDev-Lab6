import { app } from '.';

const PORT = process.env.PORT || 8080;

// listen to port
app.listen(PORT, () => console.log(`App listening on ${PORT}`));
