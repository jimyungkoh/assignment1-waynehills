import swaggerAutogen from "swagger-autogen";

const options = {
  info: {
    title: "This is my API Document",
    description: "이렇게 스웨거 자동생성이 됩니다.",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      in: "header",
      bearerFormat: "JWT",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, options).then(
  async () => {
    await import("../index.js"); // Your project's root file
  }
);
