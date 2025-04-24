# tapas

This is a simple React application built with TypeScript. It serves as a template for creating React applications with a structured folder layout.

## Project Structure

```
tapas
├── .devcontainer
├── backend
|     ├── server.js
│     ├── Dockerfile
│     ├── package.json     # npm configuration file
|
├── frontend
|     |──src
|     |   |── App.tsx        # Main application component
│     |   ├── components
│     |   ├── index.tsx      # Entry point of the application
│     |   └── types
│     |        └── index.ts  # TypeScript types and interfaces
|     ├── public
│     |     ├── index.html   # Main HTML file
│     ├── Dockerfile
│     ├── package.json     # npm configuration file
│
├── package.json           # npm configuration file
├── tsconfig.json          # TypeScript configuration file
├── docker-compose.yml     # Docker configuration file
└── README.md              # Project documentation
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```
   git clone https://github.com/taunojokinen/tapas.git
   cd tapas
   ```

2. **Install dependencies:**

   ```
   run locally: run this command in tapas, backend and frontend folders
   npm install
   ```

   run in Dev Container:

   - open Docker Desktop
   - run following commands in terminal:
     - docker-compose down
     - docker-compose up --build
   - after this you can open web browser via Docker Desktop or by typing localhost:3000 to web address
   - you can do changes to frontend and backend in the active session either in local mode or in Dev Container
   - if browser is not updating, refresh either with <F5> or <Cntrl + Shift + R>

3. **Run the application locally:**

   ```
   npm start
   ```

   This will start the development server and open the application in your default web browser.

## Usage

You can modify the `src/App.tsx` file to change the main application component. Add additional components in the `src/components` directory as needed.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
