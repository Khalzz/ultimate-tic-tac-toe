import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roomsHandler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const room = await prisma.rooms.create({
                data: {
                  players: [],
                  playerGrid: [0,0,0,0,0,0,0,0,0],
                  baseGrid: [0,0,0,0,0,0,0,0,0]
                }
            });
            console.log(room)
            res.status(200).send(room)
        } catch (error) {
            res.status(400).send('upsi')
        }
    }
}

export default roomsHandler;