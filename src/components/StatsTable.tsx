
interface Props {
    approvedRequest: number;
    pendingRequest: number;
    rejectedRequest: number;
    totalRequest: number;
}

const StatsTable = ({ approvedRequest, pendingRequest, rejectedRequest, totalRequest }: Props) => {
    return (
        <div className="overflow-x-auto p-6 mt-6">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Type of Request</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2 px-4 border-b border-gray-300">Total Requests</td>
                        <td className="py-2 px-4 border-b border-gray-300">{totalRequest}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b border-gray-300">Pending Requests</td>
                        <td className="py-2 px-4 border-b border-gray-300 text-yellow-500">{pendingRequest}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b border-gray-300">Approved Requests</td>
                        <td className="py-2 px-4 border-b border-gray-300 text-green-500">{approvedRequest}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b border-gray-300">Rejected Requests</td>
                        <td className="py-2 px-4 border-b border-gray-300 text-red-500">{rejectedRequest}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default StatsTable;
