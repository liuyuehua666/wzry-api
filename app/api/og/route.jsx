
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// 注意这里把 request 后面的类型删掉了，变成了纯 JS
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '周杰伦';
  const rank = searchParams.get('rank') || '无双王者 ★ 27';
  const kda = searchParams.get('kda') || '7 / 4 / 7';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
          backgroundColor: '#12141A', color: 'white', padding: '60px',
        }}
      >
        <div style={{ fontSize: 45, color: '#E6C280', marginBottom: 20 }}>
          王者荣耀 | 对战资料
        </div>
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 10 }}>
          {name}
        </div>
        <div style={{ fontSize: 50, color: '#FF5722', marginBottom: 60 }}>
          {rank}
        </div>
        <div
          style={{
            display: 'flex', backgroundColor: '#1C2E23', borderRadius: '20px',
            padding: '30px', borderLeft: '15px solid #4CAF50',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, color: '#81C784', fontWeight: 'bold' }}>胜利</div>
            <div style={{ fontSize: 30, color: '#8A91A3', marginTop: 10 }}>排位赛</div>
          </div>
          <div style={{ fontSize: 60, marginLeft: 100, fontWeight: 'bold' }}>
            {kda}
          </div>
        </div>
      </div>
    ),
    { width: 1000, height: 600 }
  );
}
