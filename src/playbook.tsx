import {URIAssociation} from "./URIAssociation";
import React from "react";
import {Done, EditNote, Folder, TextSnippet, Try} from "@mui/icons-material";
import Evanotebook from "./applications/evanotebook";
import {DirectoryCreate, DirectoryList} from "./pages/directories";
import './App.css';

export default {
  "name": "Default playbook",
  "description": "Default playbook for EvaTutor",
  "version": "1.0.0",
  "keywords": "EvaTutor",
  "license": "MIT",
  "author": "sanchezcarlosjr",
  "settings": {
     "language": "auto",
     "theme": {
       "mode": "auto",
       "fontFamily": "MatterVF, \"Inter\", \"SF Pro Display\", -apple-system, BlinkMacSystemFont, \"Open Sans\", \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif !important"
     },
    "applications": {
      "indexer": {
        "redirect_policy": "always /user-progress"
      }
    },
    "uriAssociation": new URIAssociation([
      {
        "name": "Notebook",
        "pattern": /^((?!\.).)*$/,
        "meta": {
          "icon": <Try />
        },
        "servicePreferenceOrder": ["evanotebook"]
      },
      {
        "name": "Notebook",
        "pattern": /.+\.done\.nb$/,
        "meta": {
          "icon": <Done/>
        },
        "servicePreferenceOrder": ["evanotebook"]
      },
      {
        "name": "Notebook",
        "pattern": /nb/,
        "meta": {
          "icon": <EditNote/>
        },
        "servicePreferenceOrder": ["evanotebook"]
      },
      {
        "name": "Plain Text",
        "pattern": /plain-text/,
        "meta": {
          "icon": <TextSnippet />
        },
        "servicePreferenceOrder": ["text-editor"]
      },
      {
        "name": "Directory",
        "pattern": /inode\/directory/,
        "meta": {
          "icon": <Folder />
        },
        "servicePreferenceOrder": ["directory"]
      }
    ])
  },
  "dependencies": [
    {
      "uri": "supabase+rpc:dependencies",
      "integrity": "",
      "headers": {},
      "environment": "browser",
      "triggers": ["authentication"]
    },
    {
      "uri": "in-memory:routes",
      "integrity": "",
      "headers": {},
      "environment": "browser",
      "triggers": ["authentication"],
      "data": [
        {
          path: 'evanotebook/:id',
          element: <Evanotebook />
        },
        {
          path: 'directory/:id',
          element: <DirectoryList/>
        },
        {
          path: '/resources/new',
          element: <DirectoryCreate/>
        }
      ]
    }
  ],
  "tasks": []
}