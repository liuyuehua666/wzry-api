import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// 这一行非常关键：因为要下载外部图片，需要允许外部跨域
export const alt = "王者荣耀对战战绩";
export const size = { width: 1000, height: 1600 }; // 调高图片高度以容纳列表

// 主函数由 GET 改为 POST
export async function POST(request) {
  let data;
  try {
    // 获取 POST 请求体内嵌的 JSON 数据
    data = await request.json();
  } catch (e) {
    return new Response('无效的 JSON 数据', { status: 400 });
  }

  // 解构数据 (我们需要提供默认值以防空数据)
  const { player = {}, matches = [] } = data;

  // 定义基础样式
  const styles = {
    main: {
      display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
      backgroundColor: '#12141A', color: 'white', padding: '50px',
    },
    sectionTitle: { fontSize: 35, color: '#8A91A3', marginBottom: 20, marginTop: 40 },
  };

  // --- 助手函数：渲染一条战绩卡片 ---
  const renderMatchCard = (match) => {
    const isWin = match.result === '胜利';
    const cardBg = isWin ? '#1C2E23' : '#2D1A1A'; // 胜绿败红
    const themeColor = isWin ? '#4CAF50' : '#F44336';

    return (
      <div style={{
        display: 'flex', alignItems: 'center', backgroundColor: cardBg,
        borderRadius: '20px', padding: '30px', marginBottom: '25px',
        borderLeft: `15px solid ${themeColor}`, width: '100%',
      }}>
        {/* 英雄头像 (云端会动态下载这个 URL) */}
        <img
          src={match.heroIcon || 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.png'}
          style={{ width: '120px', height: '120px', borderRadius: '60px', marginRight: '40px' }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 40, fontWeight: 'bold', color: themeColor }}>{match.result}</span>
            <span style={{ fontSize: 28, color: '#8A91A3' }}>{match.time || '刚刚'}</span>
          </div>
          <div style={{ fontSize: 28, color: 'white', marginTop: '10px' }}>{match.type || '排位赛'}</div>
        </div>

        {/* 这一场的 KDA */}
        <div style={{ fontSize: 55, fontWeight: 'bold', marginLeft: '60px', minWidth: '250px', textAlign: 'right' }}>
          {match.kda}
        </div>
      </div>
    );
  };

  // --- 最终排版渲染 ---
  return new ImageResponse(
    (
      <div style={styles.main}>
        <div style={{ fontSize: 45, color: '#E6C280', marginBottom: 20 }}>王者荣耀 | 荣誉主页</div>

        {/* --- 上部：玩家主页概览 --- */}
        <div style={{
          display: 'flex', alignItems: 'center', backgroundColor: '#1C1F26',
          borderRadius: '20px', padding: '40px', border: '2px solid #2A2E38'
        }}>
          {/* 玩家头像 */}
          <img
            src={player.avatar || 'https://game.gtimg.cn/images/yxzj/web201706/images/comm/logo.png'}
            style={{ width: '160px', height: '160px', borderRadius: '80px', marginRight: '40px', border: '5px solid #E6C280' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 10 }}>{player.name || '神秘玩家'}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* 段位图标 (这里通常需要传入段位对应的图片 URL) */}
              {player.rankIcon && <img src={player.rankIcon} style={{ width: '50px', height: '50px', marginRight: '15px' }} />}
              <span style={{ fontSize: 40, color: '#FF5722' }}>{player.rank || '不屈白银'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '40px' }}>
            <div style={{ fontSize: 30, color: '#8A91A3' }}>赛季总KDA</div>
            <div style={{ fontSize: 70, fontWeight: 'bold', color: '#E6C280' }}>{player.globalKda || '0.0'}</div>
          </div>
        </div>

        {/* --- 下部：近期战绩列表 --- */}
        <div style={styles.sectionTitle}>近期对战记录 ({matches.length}场)</div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* 这里是 Next.js 的魔法：遍历数据数组，动态生成多张卡片 */}
          {matches.length > 0 
            ? matches.map((match, index) => renderMatchCard(match))
            : <div style={{ fontSize: 30, color: '#8A91A3', textAlign: 'center', marginTop: 50 }}>暂无战绩记录</div>
          }
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
