FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno install --allow-scripts && deno task build

CMD ["deno", "task", "start"]
