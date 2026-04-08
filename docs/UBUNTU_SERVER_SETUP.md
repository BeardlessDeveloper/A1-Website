# Ubuntu Server Setup — A1 Quality Paralegal API

Run these commands on your **office Ubuntu machine**. Everything is done in the terminal.

---

## 1. Prerequisites

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Confirm versions
node --version    # should show v20.x.x
npm --version
```

---

## 2. Install PM2 (process manager)

```bash
sudo npm install -g pm2
```

---

## 3. Get the API code onto the machine

If you have git on the Ubuntu machine:

```bash
sudo apt install -y git
git clone https://github.com/BeardlessDeveloper/A1-API.git ~/a1-api
```

> If A1-API is not yet pushed to GitHub, copy the folder from your Windows machine to Ubuntu using
> `scp` or a USB drive, then place it at `~/a1-api`.

---

## 4. Install dependencies

```bash
cd ~/a1-api
npm install
```

---

## 5. Create your environment file

```bash
cp .env.example .env
nano .env
```

Fill in the values. The file looks like this — replace the placeholders:

```
PORT=3001
ALLOWED_ORIGINS=https://beardlessdeveloper.github.io,https://www.a1paralegal.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=a1qualitydocuments@gmail.com
SMTP_PASS=your-gmail-app-password-here
NOTIFY_EMAIL=a1qualitydocuments@gmail.com
```

**Getting a Gmail App Password (required if you use 2-Factor Authentication):**
1. Go to myaccount.google.com → Security → 2-Step Verification → App passwords
2. Choose "Mail" and "Other (custom name)", name it "A1 API"
3. Copy the 16-character password into `SMTP_PASS`

Save and close: `Ctrl+O`, Enter, `Ctrl+X`

---

## 6. Test the server manually

```bash
node src/index.js
```

You should see: `A1 API listening on port 3001`

Test the health endpoint from another terminal window:

```bash
curl http://localhost:3001/health
# Expected: {"ok":true}
```

Press `Ctrl+C` to stop.

---

## 7. Start with PM2

```bash
cd ~/a1-api
pm2 start ecosystem.config.cjs
pm2 save                        # saves process list so it survives reboots
```

Tell PM2 to start on system boot:

```bash
pm2 startup
```

PM2 will print a command for you to copy and run. It looks like:

```
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u youruser --hp /home/youruser
```

Run that exact command, then:

```bash
pm2 save
```

**Useful PM2 commands:**

```bash
pm2 status            # see if a1-api is running
pm2 logs a1-api       # tail live logs
pm2 restart a1-api    # restart after a code change
pm2 stop a1-api       # stop
```

---

## 8. Install Cloudflare Tunnel (cloudflared)

This exposes your server to the internet without a static IP or open firewall ports.

```bash
# Download and install the cloudflared package
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update
sudo apt install -y cloudflared
```

Confirm installation:

```bash
cloudflared --version
```

---

## 9. Authenticate cloudflared with your Cloudflare account

```bash
cloudflared tunnel login
```

This will print a URL. Open it in your browser, log into Cloudflare, and select your domain. A certificate will be saved automatically to `~/.cloudflared/`.

---

## 10. Create the tunnel

```bash
cloudflared tunnel create a1-api
```

This prints a **Tunnel ID** — copy it, you will need it in the next step.

---

## 11. Create the tunnel config file

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste this, replacing `YOUR_TUNNEL_ID` with the ID from the previous step and updating the hostname to match your domain:

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/YOUR_UBUNTU_USERNAME/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: api.a1paralegal.com
    service: http://localhost:3001
  - service: http_status:404
```

Save and close: `Ctrl+O`, Enter, `Ctrl+X`

---

## 12. Route the tunnel to your domain DNS

```bash
cloudflared tunnel route dns a1-api api.a1paralegal.com
```

This automatically creates a CNAME record in Cloudflare DNS pointing `api.a1paralegal.com` at your tunnel. (You do not need to open any router ports.)

---

## 13. Run the tunnel as a system service

```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared     # starts automatically on reboot
```

Check it is running:

```bash
sudo systemctl status cloudflared
```

---

## 14. Verify end-to-end

From any device on any network (not just your LAN), run:

```bash
curl https://api.a1paralegal.com/health
# Expected: {"ok":true}
```

If that returns correctly, your server is live and reachable through Cloudflare.

---

## Updating the API code

When you make changes to `src/index.js`:

```bash
cd ~/a1-api
git pull          # if using git
pm2 restart a1-api
```
