import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const removeValue = (list, value) => {
  return list.flatMap(element => {
    if (element != value) {
      console.log(value, '-', element)
      return element;
    } else {
      return []
    }
  })
}

const findWinner = (playerGrid, baseGrid, io, roomId, players, turn) => {
  let winner = null

  const winningCases = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [7,5,3]
  ];
  winningCases.forEach(function (p) {
    if (baseGrid.includes(p[0]) && baseGrid.includes(p[1]) && baseGrid.includes(p[2])) {
      if (playerGrid[p[0]-1] == 1 && playerGrid[p[1]-1] == 1 && playerGrid[p[2]-1] == 1) {
        winner = players[0]
      } else if (playerGrid[p[0]-1] == 2 && playerGrid[p[1]-1] == 2 && playerGrid[p[2]-1] == 2) {
        winner = players[1]
      }
    }
  })

  if (turn == 9 && winner == null) {
    return 'draw'
  } else {
    return winner
  }
}

const SocketHandler = (req, res) => {
    if (!res.socket.server.io) {
      console.log('Socket is starting');
      const io = new Server(res.socket.server);

      io.on('connection', socket => {
        socket.on('connect-room', (roomId) => {
          // this is to leave every room before connecting to a new one
          for (const room of socket.rooms) {
            if (room !== socket.id) {
              socket.leave(room);
            }
          }
          socket.join(roomId)
        })

        socket.on('check-room', async (roomId) => {
          try {
            const check = await prisma.rooms.findUnique({
              where: {
                id: roomId
              }
            })
            socket.broadcast.to(roomId).emit('joined player', check)
            socket.emit('return-room', check)
          } catch (error) {
            console.log(error.message);
          }
        })

        socket.on('set-player', async (user, roomId) => {
          try {
            const check = await prisma.rooms.findUnique({
              where: {
                id: roomId
              }
            });

            if (!check) {
              throw new Error('Theres no room with this id');
            }
            if (check.players.length == 2 && !check.players.includes(JSON.stringify(user))) {
              throw new Error('You are not avalible to join the room');
            } 
            if (!user || check.players.includes(JSON.stringify(user)) || check.players.length == 2) {
              socket.emit('return-room', check);
            } else if (user) {
              check.players.push(JSON.stringify(user));
              const update = await prisma.rooms.update({
                where: {
                  id: roomId
                },
                data: {
                  players: check.players,
                },
              });
              socket.broadcast.to(roomId).emit('joined player', update)
              io.to(roomId).emit('return-room', update);
            }
          } catch (error) {
            socket.emit('error', error.message)
          }
        })

        socket.on('get-turn', async (roomId) => {
          try {
            const check = await prisma.rooms.findUnique({
              where: {
                id: roomId
              }
            })
            io.to(roomId).emit('player-turn', check.players[check.moveNumber % 2])
            console.log('send:', check.players[check.moveNumber % 2])
          } catch (error) {
            console.log(error);
          }
        })

        socket.on('play-turn', async (roomId, player, x) => {
          try {
            const check = await prisma.rooms.findUnique({
              where: {
                id: roomId
              }
            })
            let gridPlayers = check.playerGrid;
            let grid = check.baseGrid;
            if (check.players[0] == player && gridPlayers[x] == 0) {
              gridPlayers[x] = 1;
            } else if (check.players[1] == player && gridPlayers[x] == 0) {
              gridPlayers[x] = 2;
            }
            grid[x] = x + 1;

            const update = await prisma.rooms.update({
              where: {
                id: roomId
              },
              data: {
                moveNumber: check.moveNumber + 1,
                playerGrid: gridPlayers,
                baseGrid: grid
              },
            });

            io.to(roomId).emit('return-winner', findWinner(update.playerGrid, update.baseGrid, io, roomId, update.players, update.moveNumber))
        
            // socket.broadcast.to(roomId).emit('update-grid', update)
            console.log('sending the update grid')
            io.to(roomId).emit('return-room', update)
        } catch (error) {
          console.log(error.message)
        }
        })

        socket.on('check-winner', async (roomId) => {
          try {
            const check = await prisma.rooms.findUnique({
              where: {
                id: roomId
              }
            })
            io.to(roomId).emit('return-winner', findWinner(check.playerGrid, check.baseGrid, io, roomId, check.players, check.moveNumber))

          } catch (error) {
            console.log(error.message)
          }
        })

        socket.on('restart', async (roomId) => {
          try {
            const check = await prisma.rooms.findUnique({
              where: {
                id: roomId
              }
            })

            const randomList = check.players.sort(() => {
              return Math.random() - 0.5;
            })
            const update = await prisma.rooms.update({
              where: {
                id: roomId
              },
              data: {
                players: randomList,
                moveNumber: 0,
                playerGrid: [0,0,0,0,0,0,0,0,0],
                baseGrid: [0,0,0,0,0,0,0,0,0],
              },
            });
            io.to(roomId).emit('return-room', update)
            io.to(roomId).emit('restarted')
          } catch (error) {

          }
        })
      });
      
      res.socket.server.io = io;
    } else {
      console.log('socket.io already running');
    }
    res.end();
} 

export default SocketHandler