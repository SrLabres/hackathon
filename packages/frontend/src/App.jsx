// External Libraries
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Box, Button, Input, Text, Select, Table, Thead, Tbody, Tr, Th, Td, ChakraProvider } from '@chakra-ui/react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;
// Styles
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [collection, setCollection] = useState(null);
    const [data, setData] = useState([]);
    const fileInputRef = useRef(null);

    const fetchData = async () => {
        const response = await axios.get(`${apiUrl}/data`);
        setData(response.data.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileUpload = () => {
        const selectedFile = fileInputRef.current.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            console.log('Arquivo selecionado:', selectedFile.name);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsUploading(true);
            const response = await axios.post(`${apiUrl}/upload/${collection}`, formData);
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao fazer upload:", error);
            alert('Erro ao fazer upload do arquivo.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <ChakraProvider>
            <FileUploadBox 
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                handleUpload={handleUpload}
                isUploading={isUploading}
                setCollection={setCollection}
            />
            <DataTable data={data} />
        </ChakraProvider>
    );
}

const FileUploadBox = ({ fileInputRef, handleFileUpload, handleUpload, isUploading, setCollection }) => (
    <Box p={6} w="400px" boxShadow="lg" borderRadius="md" mx="auto" my="10%">
        <Text fontSize="xl" mb={4}>Upload de Arquivos</Text>
        <Input
            ref={fileInputRef}
            type="file"
            mb={4}
            placeholder="Escolha um arquivo"
            onChange={handleFileUpload}
        />
        <Select placeholder="Selecione uma collection" mb={4} onChange={(event) => setCollection(event.target.value)}>
            <option value="jusbrasil">JusBrasil</option>
            <option value="procon">Procon</option>
            <option value="reclameaqui">ReclameAqui</option>
            <option value="base">base</option>
        </Select>
        <Button colorScheme="blue" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? 'Enviando...' : 'Enviar'}
        </Button>
    </Box>
);

const DataTable = ({ data }) => (
    <Box overflowX="auto">
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>NUM_PESSOA</Th>
                    <Th>Probabilidade de Processar</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data?.map((item, index) => (
                    <Tr key={index}>
                        <Td>{item.NUM_PESSOA}</Td>
                        <Td>{item.score}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </Box>
);

export default App;