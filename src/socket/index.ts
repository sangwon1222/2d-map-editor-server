import { Server } from "socket.io";

const isProduction = process.env.NODE_ENV == "production";
const origin = isProduction ? 'http://lsw.kr' : '*'


export class Socket{
  private mSocket: Server
  private mRobyUsers:any
  private mRoomIndex: number
  private mUserIdAry: string[]

  get userIdAry(): string[]{
  return this.mUserIdAry
}
  
  constructor(http:any){
    // const { clientsCount } = (io.engine as any)
    this.mSocket = new Server(http,{cors:{ origin,credentials:isProduction}})
    this.mRobyUsers = {}
    this.mRoomIndex = 0
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
      

      this.mRobyUsers[socket.id] = true
      socket.data.roomName = '';
      socket.data.nickname = '';
      socket.data.rooms = [...(socket as any).adapter.sids]



      socket.on('income', async ({ nickname })=>{
        const data = await userInfo()
        let ok = false
        for(let i=0; i < data.length; i++){
          if(data[i].nickname === nickname) {
            ok = false 
            break;
          }
          ok = true
        }
        
        socket.data.nickname = ok ? nickname : ''
        const socketUserList = ok ? await userInfo() : data
        const myNickname = ok ? nickname : ''
        const socketId = ok ? socket.id : ''

        socket.emit('regist-user-id',{ ok, socketUserList, nickname: myNickname, socketId })
        if(ok)socket.broadcast.emit('update-user-list',{ socketUserList, nickname: myNickname })
      })

      socket.on("get-user-list",async ()=>{
        const socketUserList = await userInfo()
        socket.emit('get-user-list',{ socketUserList })
      })

      
      socket.on("add-chat", async ({nickname,chat,time}:{nickname:string,chat:string, time: string}) => {
        socket.emit('add-chat',{ nickname,chat,time })
        socket.broadcast.emit("add-chat", {nickname,chat,time});
      });

      socket.on("update-map-json", async ({mapJson}) => {
        socket.broadcast.emit("update-map-json", {
          mapJson: mapJson,
        });
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
