import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const data = await request.json();
    const { player = {}, matches = [] } = data;

    // 动态计算图片高度：头部大约 450px，每条战绩大约 160px
    const dynamicHeight = 450 + (matches.length * 160) + 100;

    return new ImageResponse(
      (
        <div style={{
          display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100%',
          backgroundColor: '#12141A', color: 'white', padding: '50px', fontFamily: 'sans-serif'
        }}>
          
          {/* --- 顶部栏 --- */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 40, color: '#E6C280', fontWeight: 'bold' }}>王者荣耀 | 荣誉主页</div>
            <div style={{ fontSize: 28, color: '#8A91A3' }}>Powered by 周杰伦</div>
          </div>

          {/* --- 上半部：玩家主页卡片 --- */}
          <div style={{
            display: 'flex', alignItems: 'center', backgroundColor: '#1C1F26',
            borderRadius: '20px', padding: '30px', border: '2px solid #2A2E38', marginBottom: 40
          }}>
            {/* 玩家头像 */}
            <img src={player.avatar || 'https://game.gtimg.cn/images/yxzj/web201706/images/comm/logo.png'}
                 style={{ width: '140px', height: '140px', borderRadius: '70px', border: '4px solid #E6C280', marginRight: 30 }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: 50, fontWeight: 'bold', marginBottom: 15 }}>{player.name || '神秘玩家'}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={player.rankIcon} style={{ width: '45px', height: '45px', marginRight: 10 }} />
                <span style={{ fontSize: 35, color: '#FF5722', fontWeight: 'bold', marginRight: 20 }}>{player.rank || '未知段位'}</span>
                <span style={{ fontSize: 30, color: '#8A91A3' }}>胜率: {player.winRate}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: 28, color: '#8A91A3', marginBottom: 10 }}>综合战斗力</div>
              <div style={{ fontSize: 55, color: '#4CAF50', fontWeight: 'bold' }}>{player.fightPower}</div>
            </div>
          </div>

          {/* --- 下半部：战绩列表 --- */}
          <div style={{ fontSize: 32, color: '#8A91A3', marginBottom: 20 }}>近期对战 ({matches.length}场)</div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {matches.map((match, index) => {
              const isWin = match.result === '胜利';
              return (
                <div key={index} style={{
                  display: 'flex', alignItems: 'center', backgroundColor: isWin ? '#15251B' : '#2A171A',
                  borderRadius: '16px', padding: '25px', marginBottom: '20px',
                  borderLeft: `10px solid ${isWin ? '#4CAF50' : '#F44336'}`
                }}>
                  <img src={match.heroIcon} style={{ width: '100px', height: '100px', borderRadius: '50px', marginRight: 30 }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
                    <div style={{ fontSize: 40, fontWeight: 'bold', color: isWin ? '#81C784' : '#E57373', marginBottom: 10 }}>
                      {match.result}
                    </div>
                    <div style={{ fontSize: 26, color: '#8A91A3' }}>{match.type}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}>
                    <div style={{ fontSize: 45, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>{match.kda}</div>
                    <div style={{ fontSize: 26, color: '#E6C280' }}>评分: {match.score}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '200px' }}>
                     <div style={{ fontSize: 28, color: '#FFA726', fontWeight: 'bold', marginBottom: 10 }}>{match.tags}</div>
                     <div style={{ fontSize: 24, color: '#636A7D' }}>{match.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
      { width: 1000, height: dynamicHeight } // 宽高动态自适应
    );
  } catch (error) {
    return new Response('Error rendering image', { status: 500 });
  }
}
