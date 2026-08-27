import HistoryCard from './HistoryCard'

function HistoryGroup({ group, friends, onDelete }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{group.label}</h2>
      <div className="space-y-3">
        {group.items.map(item => {
          const friend = friends.find(entry => entry.id === item.friendId)
          return <HistoryCard key={item.id} item={item} friendName={friend?.name} onDelete={onDelete} />
        })}
      </div>
    </section>
  )
}

export default HistoryGroup
