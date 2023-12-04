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
            res.status(200).send(room)
        } catch (error) {
            console.log(error)
            res.status(400).send({error: {message: "the room wasn't made", reason: error}})
        }
    }
}

export default roomsHandler;