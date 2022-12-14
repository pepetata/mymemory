# when instance is started or rebooted
# cd mymemory
# sudo service docker start
# docker-compose up -d
# sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
# 
#
# cd C:\MyIdolApp\mymemory
# ssh -i "../AWS_MyMemory.pem" ec2-user@ec2-54-175-193-172.compute-1.amazonaws.com
#

# docker build -t mymemory-docker .
# nao esta ok --> docker run -p 3000:3000 mymemory-docker --name mymemory
# docker run -p 3000:3000  --name mymemory -d mymemory-docker  --> run in background
# docker logs mymemory         --> only see the current logs
# docker logs -f mymemory      --> see logs while happening --> ctrl C to stop seeing the log
# docker stop mymemory
# docker start mymemory
#
# docker-compose up -d
# docker-compose up --build

# docker container list
# docker stop $(docker container list)
#
# docker ps
# docker ps -a
# docker images
# 
#
# ===== remove docker containers
# docker rm $(docker ps -qa --no-trunc)
# docker rm $(docker ps -qa --no-trunc --filter "status=exited")
#
# ===== remove docker images
# docker rmi $(docker images --filter "dangling=true" -q --no-trunc) -f
# docker rmi $(docker images | grep "none" | awk '/ / { print $3 }')
#


#
#
# install and run docker
# sudo amazon-linux-extras install docker
# sudo service docker start
# sudo usermod -a -G docker ec2-user
# Download and install docker-compose
# sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
# Fix permissions
# sudo chmod +x /usr/local/bin/docker-compose
#
#
# para redirecionar a port 3000 para a porta 80: https://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode
# sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
#





# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
