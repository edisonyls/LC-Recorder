package com.yls.ylslc.data_structure;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DataStructureTreeService {

    // Adds a root node to the content tree
    public void addRootNode(DataStructureEntity dataStructure, DataStructureNode node) {
        prepareNode(node);
        dataStructure.getContentTree().add(node);
    }

    // Finds a node by ID in the tree structure
    public DataStructureNode findNodeById(DataStructureEntity dataStructure, String nodeId) {
        return findNodeRecursive(dataStructure.getContentTree(), nodeId);
    }

    // Adds a child node to a parent node
    public boolean addChildNode(DataStructureEntity dataStructure, String parentNodeId, DataStructureNode childNode) {
        DataStructureNode parent = findNodeById(dataStructure, parentNodeId);
        if (parent == null) {
            return false;
        }

        prepareNode(childNode);
        if (parent.getChildren() == null) {
            parent.setChildren(new java.util.ArrayList<>());
        }
        parent.getChildren().add(childNode);
        return true;
    }

    // Removes a node by ID from the tree structure
    public boolean removeNodeById(DataStructureEntity dataStructure, String nodeId) {
        return removeNodeRecursive(dataStructure.getContentTree(), nodeId);
    }

    // Updates a node's name and/or content
    public boolean updateNode(DataStructureEntity dataStructure, String nodeId, String name, String content) {
        DataStructureNode node = findNodeById(dataStructure, nodeId);
        if (node == null) {
            return false;
        }

        if (name != null) {
            node.setName(name);
        }
        if (content != null) {
            node.setContent(content);
        }
        return true;
    }

    // Counts total nodes in the tree
    public int countNodes(DataStructureEntity dataStructure) {
        return countNodesRecursive(dataStructure.getContentTree());
    }

    // Gets the level/depth of a specific node
    public int getNodeLevel(DataStructureEntity dataStructure, String nodeId) {
        return getNodeLevelRecursive(dataStructure.getContentTree(), nodeId, 0);
    }

    // Private helper methods
    private void prepareNode(DataStructureNode node) {
        if (node.getId() == null) {
            node.setId(UUID.randomUUID().toString());
        }
        if (node.getCreatedAt() == null) {
            node.setCreatedAt(LocalDateTime.now());
        }
        if (node.getChildren() == null) {
            node.setChildren(new java.util.ArrayList<>());
        }
        if (node.getOrderIndex() == null) {
            node.setOrderIndex(0);
        }
    }

    private DataStructureNode findNodeRecursive(List<DataStructureNode> nodes, String nodeId) {
        for (DataStructureNode node : nodes) {
            if (node.getId().equals(nodeId)) {
                return node;
            }
            if (node.getChildren() != null) {
                DataStructureNode found = findNodeRecursive(node.getChildren(), nodeId);
                if (found != null) {
                    return found;
                }
            }
        }
        return null;
    }

    private boolean removeNodeRecursive(List<DataStructureNode> nodes, String nodeId) {
        for (int i = 0; i < nodes.size(); i++) {
            DataStructureNode node = nodes.get(i);
            if (node.getId().equals(nodeId)) {
                nodes.remove(i);
                return true;
            }
            if (node.getChildren() != null && removeNodeRecursive(node.getChildren(), nodeId)) {
                return true;
            }
        }
        return false;
    }

    private int countNodesRecursive(List<DataStructureNode> nodes) {
        int count = 0;
        for (DataStructureNode node : nodes) {
            count++; // Count current node
            if (node.getChildren() != null) {
                count += countNodesRecursive(node.getChildren());
            }
        }
        return count;
    }

    private int getNodeLevelRecursive(List<DataStructureNode> nodes, String nodeId, int currentLevel) {
        for (DataStructureNode node : nodes) {
            if (node.getId().equals(nodeId)) {
                return currentLevel;
            }
            if (node.getChildren() != null) {
                int level = getNodeLevelRecursive(node.getChildren(), nodeId, currentLevel + 1);
                if (level >= 0) {
                    return level;
                }
            }
        }
        return -1;
    }
}
