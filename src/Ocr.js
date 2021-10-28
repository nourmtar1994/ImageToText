import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Progress, Select, message } from 'antd';

import { FilePond } from 'react-filepond';
import { createWorker } from 'tesseract.js';

const { Meta } = Card;
const { Option } = Select;



const Ocr = () => {
    const [img, setImg] = useState(null)
    const [text, setText] = useState(null)
    const [progress, setProgress] = useState({ pctg: 0, status: null })
    const [Language, setLanguage] = useState(null)

    const worker = createWorker({
        logger: m => {
            console.log(m)
            if (m.status === "recognizing text") {
                let pctg = (m.progress / 1) * 100
                setProgress({ ...progress, pctg: pctg.toFixed(2), status: m.status })
            }
        }
    });

    const handleOcr = async () => {

        if (img) {
            setImg(null)
            setText(null);
            setProgress({ pctg: 0, status: null })
            await worker.load();
            await worker.loadLanguage(Language);
            await worker.initialize(Language);
            const { data: { text } } = await worker.recognize(img);
            setText(text);
            await worker.terminate();
        }
    };
    const resetAll = () => {
        setImg(null)
        setText(null);
        setProgress({ pctg: 0, status: null })
        setLanguage(null)
    }

    useEffect(() => {
        Language === null ? message.error('select Your Language') : handleOcr()
    }, [img, Language])


    return (
        <Row >

            <Col md={{ span: 12, offset: 6 }} sm={{ span: 22, offset: 1 }} >
                <br />
                <h1 align="center" >Tesseract Ocr</h1>
                <br />
                <Card
                    style={{ width: '100%' }}
                    cover={
                        <FilePond ref={ref => ref}
                            onaddfile={(err, file) => setImg(file.file)}
                            onremovefile={() => { resetAll() }}
                            style={{ height: '400px' }}
                        />
                    }
                    actions={[
                        progress.pctg > 0 ? <Progress percent={progress.pctg} showInfo={false} /> : progress.status
                    ]}
                >
                    <Select
                        value={Language}
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select a person"
                        optionFilterProp="children"
                        onChange={(e) => setLanguage(e)}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

                        }

                    >
                        <Option value="eng">English</Option>
                        <Option value="ara">Arabic</Option>
                        <Option value="fra">French</Option>
                        <Option value="ita">Italian</Option>
                        <Option value="jpn">Japanese</Option>
                    </Select>
                    <br />
                    <br />
                    <Meta
                        title="Text to converter"
                        description={<pre style={{ textAlign: 'center' }} >{text}</pre>}
                    />
                </Card>
            </Col>
        </Row>

    )
}
export default Ocr