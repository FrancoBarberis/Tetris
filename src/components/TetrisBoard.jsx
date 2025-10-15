
export default function TetrisBoard({ board }) {
  return (
    <div className="grid grid-rows-20 grid-cols-10 gap-[1px] bg-gray-900">
      {board.flat().map((cell, i) => (
        <div
          key={i}
          className={`w-6 h-6 ${
            cell ? 'bg-blue-500' : 'bg-gray-800'
          } border border-gray-900`}
        />
      ))}
    </div>
  );
}