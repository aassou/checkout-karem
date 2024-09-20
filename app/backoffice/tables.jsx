function Tables() {
  const [branches] = useState([{ name: 'Main Branch' }, { name: 'Branch 2' }]); // Static example for now
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  const handleAddTable = () => {
    const newTable = { number: tableNumber };
    setTables([...tables, newTable]);
    setTableNumber('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Tables</h2>

      {/* Branch Selector */}
      <div className="mb-6">
        <select
          value={selectedBranch.name}
          onChange={(e) => setSelectedBranch(branches.find(branch => branch.name === e.target.value))}
          className="border p-2 mr-2"
        >
          {branches.map((branch, index) => (
            <option key={index} value={branch.name}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table Add Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddTable} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Table
        </button>
      </div>

      {/* Table List */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Table Number</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table, index) => (
            <tr key={index}>
              <td className="py-2">{table.number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
