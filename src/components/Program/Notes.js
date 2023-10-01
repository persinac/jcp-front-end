import React, {useEffect, useState} from 'react';
import {Item, Button, Form, Modal} from 'semantic-ui-react';
import {createNotes, getNotesByProgramId, updateNotes} from "./api";

const formatDate = (timestamp) => {
    const date = timestamp ? new Date(timestamp) : new Date();

    const YYYY = date.getUTCFullYear();
    const MM = String(date.getUTCMonth() + 1).padStart(2, '0'); // January is 0!
    const DD = String(date.getUTCDate()).padStart(2, '0');
    const HH = String(date.getUTCHours()).padStart(2, '0');
    const MIN = String(date.getUTCMinutes()).padStart(2, '0');
    const SS = String(date.getUTCSeconds()).padStart(2, '0');

    return `${YYYY}-${MM}-${DD} ${HH}:${MIN}:${SS}`;
}

const CoachesNotes = ({currentProgram}) => {
    const [notes, setNotes] = useState([]);

    const [editingNote, setEditingNote] = useState(null);
    const [newNote, setNewNote] = useState({});
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        getNotesByProgramId(currentProgram['id'])
            .then(response => setNotes(response))
        setNewNote({
            title: '',
            program_id: currentProgram['id'],
            notes: '',
            updated_at: '',
        });
    }, [currentProgram]);

    const handleSubmitNewNote = async () => {
        const newId = await createNotes([newNote])
        setNotes([...notes, {...newNote, id: newId['id']}]);
        setNewNote({
            title: '',
            program_id: currentProgram['id'],
            notes: '',
            updated_at: '',
        });
        setOpenModal(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleEditNote = (id) => {
        const note = notes.find((note) => note.id === id);
        setEditingNote(note);
    };

    const handleSaveEdit = async () => {
        await updateNotes([editingNote])
        setNotes(notes.map(note => note.id === editingNote.id ? editingNote : note));
        setEditingNote(null);
    };

    return (
        <div style={{ width: "100%"}}>
            <Item.Group>
                {notes.map((note) => (
                    editingNote && editingNote.id === note.id ? (
                        <Form key={note.id}>
                            <Form.Input
                                value={editingNote.title}
                                onChange={(e) => setEditingNote({...editingNote, header: e.target.value})}
                            />
                            <Form.TextArea
                                value={editingNote.notes}
                                onChange={(e) => setEditingNote({...editingNote, description: e.target.value})}
                            />
                            <Button onClick={handleSaveEdit}>Save</Button>
                        </Form>

                    ) : (
                        <Item key={note.id}>
                            <Item.Content>
                                <Item.Header as='a'>{note.title}</Item.Header>
                                <Item.Description>{note.notes}</Item.Description>
                                <Item.Extra>Last Updated: {formatDate(note.updated_at)}</Item.Extra>
                                <Button onClick={() => handleEditNote(note.id)}>Edit</Button>
                            </Item.Content>
                        </Item>
                    )
                ))}
            </Item.Group>
            <Button onClick={handleOpenModal}>Add New Note</Button>

            <Modal open={openModal} onClose={handleCloseModal} className="centered-modal-override">
                <Modal.Header>Add New Note</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            placeholder="Title"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        />
                        <Form.TextArea
                            placeholder="Description"
                            value={newNote.notes}
                            onChange={(e) => setNewNote({ ...newNote, notes: e.target.value })}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button positive onClick={handleSubmitNewNote}>
                        Submit
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default CoachesNotes;
