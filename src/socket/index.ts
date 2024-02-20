import { Server } from "socket.io";

const isProduction = process.env.NODE_ENV == "production";
const origin = isProduction ? 'http://lsw.kr' : '*'


export class Socket{
  private mSocket: Server
  private mRobyUsers:any
  private mMoveTimer: any
  private mUserIdAry: string[]

  get userIdAry(): string[]{
  return this.mUserIdAry
}
  
  constructor(http:any){
    // const { clientsCount } = (io.engine as any)
    this.mSocket = new Server(http,{cors:{ origin,credentials:isProduction}})
    this.mRobyUsers = {}
    this.mMoveTimer = {}
    this.mUserIdAry=[]
  }
  

  connect(){
    this.mSocket.on("connect", async (socket) => {
      console.log("socket connect")

      const userInfo = async () => {
        const sockets = await this.mSocket.fetchSockets();
        return sockets.map(({ id,data  }) => { 
          return { socketId: id, nickname: data.nickname } 
        })
      }

      const userNicknames: any = async () => {
        const sockets = await this.mSocket.fetchSockets();
        const data: { [key: string]: number[]} =  {}
        for(let i=0; i<sockets.length; i++){
          if(sockets[i].data.nickname) data[sockets[i].data.nickname] = sockets[i].data.path
        }
        return data
      }
      

      this.mRobyUsers[socket.id] = true
      socket.data.roomName = '';
      socket.data.nickname = '';
      socket.data.path = [];
      socket.data.rooms = [...(socket as any).adapter.sids]

      socket.on('income', async ({nickname, path})=>{
        socket.data.nickname = nickname
        socket.data.path = path
        socket.data.timeout =[]
        const users = await userNicknames()
        socket.emit('insert-user',{ users })
        socket.broadcast.emit('insert-user',{ users })
      })

      socket.on("insert-user", async () => {
        const users = await userNicknames()
        socket.emit('insert-user',{ users })
        socket.broadcast.emit("insert-user", { users });
      });
      
      socket.on("update-user-pos", async ({ nickname, path }) => {
        socket.data.path = path
        const users = await userNicknames()
        socket.emit('update-user-pos',{ users })
        socket.broadcast.emit("update-user-pos", { users });
      });

      socket.on("remove-prev-move", async () => {
        for(let i=0; i < socket.data.timeout.length; i++){
          clearTimeout(socket.data.timeout[i])
        }
        socket.data.timeout =[]
    });

      socket.on("user-move", async ({ nickname, pathList }:{nickname:string, pathList:number[][]}) => {
          socket.data.path = pathList
          socket.data.timeout = []
          for(let i=0; i<pathList.length; i++){
            socket.data.timeout[i] = setTimeout(() => {
              const prev = i > 0 ? pathList[ i - 1 ] : pathList[ i ]
              socket.emit('user-move',{ nickname, path: pathList[i]  ,prev })
              socket.broadcast.emit("user-move", { nickname, path: pathList[i] , prev } );
            }, 150*i);
          }
      });

      socket.on("leave-user", async () => {
        const users = await userInfo()
        socket.broadcast.emit("leave-user", {
          nickname: socket.data.nickname,
          socketUserList: users,
        });
      });

      socket.on("disconnect", async () => {
        socket.leave(socket.data.roomName)
        const users = await userInfo()
        
        socket.broadcast.emit("leave-user", {
          nickname: socket.data.nickname,
          socketUserList: users,
        });
      });
    });
  
    this.mSocket.listen(3000);
  }
}
