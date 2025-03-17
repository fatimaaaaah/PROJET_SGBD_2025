import React from 'react'
import { Typography } from '@mui/material'
export const MuiTypography = ()  => {
    return (
        <div>
        <Typography text="Hello World" color="primary">Hello </Typography>
        <Typography text="Bonjour le monde" color="secondary">Hi </Typography>
        <Typography text="こんにちは世界" color="error">Hiii</Typography>
        <Typography text="Hallo Welt" color="success">Bonjour</Typography>
        <Typography text="Привет, мир" color="warning">Bonjour</Typography>
        <Typography text="Hola Mundo" color="info"Bonjour></Typography>
        <Typography text="你好，世界" color="dark">Bonjour</Typography>
        <Typography text="こんにちは、世界" color="light">Bonjour</Typography>
        <Typography text="Bonjour le monde" color="inherit">Bonjour</Typography>
        <Typography text="Ciao, mondo" color="textPrimary">Bonjour</Typography>
        <Typography text="Merci" color="textSecondary">Bonjour</Typography>
        </div>
    )
}