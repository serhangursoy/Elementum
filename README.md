# Elementum - WIP

**Working In Project -- Not Done**

This is a minimal Electron application that is designed for collaboration tool for software developers. It's inspired from the current development tools. However, it's one of the best advantage is that, all data is stored in _your_ own Firebase account. And this is only required if you are the creator of that team. If you are a team member, you should just go and enter your given hashed link and your are done!

A basic Elementum application needs just these files:
- `Elementum Core Application` - This does the whole big stuff. Handles REST requests and UI side.
- `Firebase Account (If Distributor)` - If you are the creator of the Team, you need to link your Firebase account so others can use it as well.
- `Elementum Key (If Team Member)` - Get your key, sign-in and you are done. Now you are part of a team.

## Motivation
Collaboration is required if you are working as a group on a project. Current collaboration tools are great. However, if your team is really small, then those tools become extremely useless with it's tons of features. Furthermore, some collaboration tools are really expensive for small teams. So I decided to create a simple, easy, light collaboration tool for everyone.
I decided not to keep any server ( and user data ) not to work on latest GPDR. So, in theory, there is **no data limit**, for all users. Because everyone will use their Firebase account.

## Features   
I'm planning to add some Features most of them sound kinda basic,
- Dynamic Setup Structure for every Firebase Account( Only for data storage )
- Dashboard for both Users and Admin to track Project's status
- Assignment Creation - Assigning to User Functions
- Messaging System - Both messaging groups and user-to-user private chat
- Project Related Stuff Share and Post Walls
---------------- Below is **planned** features ----------------
- Git version tracker. Commit logger.
- User performance reporter
- ML backed suggestions for project


## Usage
I will add instructions with _cute_ step-by-step like screenshots when project is done.

## Developing
Clone this, do your magic

```bash
# Clone this repository
git clone https://github.com/serhangursoy/Elementum
# Go into the repository
cd Elementum
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.
