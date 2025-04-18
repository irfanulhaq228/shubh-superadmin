import { Divider, Radio, Table, Button } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';

const columns = [
    {
        title: 'Sr#',
        dataIndex: 'index',
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
    },
    {
        title: 'Game Name',
        dataIndex: 'gameName',
    },
    {
        title: 'Market Name',
        dataIndex: 'marketName',
    },
    {
        title: 'Selector Name',
        dataIndex: 'selectionName',
    },
    {
        title: 'Side',
        dataIndex: 'side',
        render: (side: string) => (
            <p className={`h-[25px] capitalize rounded-[20px] text-[12px] font-[500] w-[60px] flex justify-center items-center ${side === "Back" ? "bg-[#008efb24]" : "bg-[#d9517847]"}`}>
                {side}
            </p>
        ),
    },
    {
        title: 'Odd',
        dataIndex: 'odd',
    },
    {
        title: 'Stake',
        dataIndex: 'stake',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status: string) => (
            <span className='text-yellow-500 bg-yellow-50 px-[10px] py-[5px] capitalize rounded-[20px] text-[12px] font-[500] border border-yellow-200'>
                {status}
            </span>
        ),
    }
];

const BetsResultTable = ({ bets, selectedIds, setSelectedIds }: any) => {

    const rowSelection: TableRowSelection<typeof bets[0]> = {
        type: 'checkbox',
        selectedRowKeys: selectedIds,
        onChange: (selectedRowKeys) => {
            setSelectedIds(selectedRowKeys as string[]);
        },
    };

    return (
        <div className='rounded-[10px] overflow-hidden border border-gray-200'>
            <Table
                loading={false}
                columns={columns}
                rowSelection={rowSelection}
                dataSource={bets.map((bet: any, index: number) => ({ ...bet, key: bet._id, createdAt: `${new Date(bet?.createdAt).toDateString()}, ${new Date(bet?.createdAt).toLocaleTimeString()}`, index: index + 1 }))}
                onRow={(record) => ({
                    onClick: () => {
                        const selectedKey = record.key;
                        const isSelected = selectedIds.includes(selectedKey);
                        setSelectedIds(isSelected ? selectedIds.filter((id: any) => id !== selectedKey) : [...selectedIds, selectedKey]);
                    },
                })}
            />
        </div>
    )
}

export default BetsResultTable