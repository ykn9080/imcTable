import React from 'react';
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'
import { easeElastic } from 'd3-ease';




const Dendrogram = () => {

    // const data = {
    //     name: 'Parent',
    //     children: [{
    //         name: 'Child One'
    //     }, {
    //         name: 'Child Two'
    //     }]
    // };

    const data = {
        name: 'Colour',
        children: [
            {
                name: 'Black',
                pathProps: 'black',
                children: []
            }, {
                name: 'Blue',
                children: [
                    {
                        name: 'Aquamarine',
                        children: [
                            {
                                name : 'DDDD',
                                children: [],
                            }
                        ]
                    }, {
                        name: 'Cyan',
                        children: []
                    }, {
                        name: 'Navy',
                        children: []
                    }, {
                        name: 'Turquoise',
                        children: []
                    }
                ]
            }, {
                name: 'Green',
                children: []
            }, {
                name: 'Purple',
                children: [
                    {
                        name: 'Indigo',
                        children: []
                    }, {
                        name: 'Violet',
                        children: []
                    }
                ]
            }, {
                name: 'Red',
                children: [
                    {
                        name: 'Crimson',
                        children: []
                    }, {
                        name: 'Maroon',
                        children: []
                    }, {
                        name: 'Scarlet',
                        children: []
                    }
                ]
            }, {
                name: 'White',
                children: []
            }, {
                name: 'Yellow',
                children: []
            }
        ]
    }

    const handleClick = (event, node) => {
        console.log('handle click ', event);
        console.log('handle click node', node);
        alert(`${node} got clicked`);
      }
    
    return (
        <Tree
        data={data}
        height={400}
        width={800}
        // pathFunc={(x1, y1, x2, y2) =>
        //     `M${y1},${x1} ${y2},${x2}`}
        animated
        duration={800}
        easing={easeElastic}
        gProps={{
            className: 'node',
            onClick: handleClick
        }}
        />
    )
}

export default Dendrogram;
