import { app } from '.';

const PORT = process.env.PORT || 3001;

// listen to port
app.listen(PORT, () => console.log(`App listening on ${PORT}`));
