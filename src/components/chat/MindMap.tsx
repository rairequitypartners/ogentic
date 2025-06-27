import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Stack } from '@/hooks/useAutonomousAgent';
import CustomNode from './CustomNode';

interface MindMapProps {
  nodes: any[];
  edges: any[];
}

const nodeTypes = {
  custom: CustomNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 70;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const MindMap: React.FC<MindMapProps> = ({ nodes, edges }) => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    // Ensure each node has type 'custom' for ReactFlow
    const customNodes = nodes.map((node) => ({
      ...node,
      type: 'custom',
      data: node, // Pass the node data directly
      position: node.position || { x: 0, y: 0 },
    }));
    return getLayoutedElements(customNodes, edges);
  }, [nodes, edges]);

  return (
    <ReactFlow
      nodes={layoutedNodes}
      edges={layoutedEdges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
    >
      <Background />
      <Controls showInteractive={false} />
      <MiniMap />
    </ReactFlow>
  );
}; 