import React from 'react';
import { Divider } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import OrderLine from './OrderLine';

const Order = ({lines, modifyLine, deleteLine}) => {
    return(
        <div
            style={{
                width:'100%',
                height: 'calc(100% - 200px)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#EDEFF2'
            }}
        >
            <PerfectScrollbar 
                options={{suppressScrollX: true}}
            >
                {lines.map((line, index) => (
                    <React.Fragment key={`fragment-${line.productId}`}>
                        <OrderLine 
                            key={`orderline-${line.productId}-${line.price}-${line.units}`} 
                            line={line} 
                            modifyLine={modifyLine}
                            deleteLine={deleteLine}
                        />
                        {(index < (lines.length - 1)) &&
                            <Divider key={index}/>
                        }
                    </React.Fragment>
                ))}
            </PerfectScrollbar>
        </div>
    )
}

export default Order;