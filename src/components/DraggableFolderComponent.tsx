// import * as React from 'react';
// import { useDrag, DragPreviewImage } from 'react-dnd';
// import { connect } from 'react-redux';
// 
// import * as DragDropActions from '../actions/DragDropActions';
// import { DragDropParams } from '../actions/DragDropActions';
// import { AppState } from './AppComponent';
// import { DraggableType } from './AppComponent';
// 
// interface ExternalProps {
//   draggableType: string;
//   rank: number;
//   hovering: boolean;
//   updateHoverRank: (rank: number, hovering: boolean) => void;
// }
// 
// interface InternalProps extends ExternalProps {
//   beginDrag: (params: DragDropParams) => void;
//   endDrag: (params: DragDropParams) => void;
// }
// 
// function DraggableListItemComponent(props: InternalProps) {
//   const [{ isDragging }, drag, preview] = useDrag({
//     item: {
//       type: props.draggableType,
//       id: props.bookmark.id,
//     },
//     canDrag: monitor => props.bookmark.id !== props.editingBookmarkId,
//     begin: monitor => {
//       props.beginDrag({ rank: props.rank });
//       return;
//     },
//     end: monitor => {
//       props.endDrag({ rank: props.rank });
//       return;
//     },
//     collect: monitor => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   })
// 
//   const emptyImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
// 
//   return (
//     <div>
//       <DragPreviewImage connect={preview} src={emptyImageSrc}/>
//       <div ref={drag}>
//         <BookmarkComponent
//           bookmark={props.bookmark}
//           editing={props.editing}
//           isDragging={isDragging}
//           hovering={props.hovering}
//           updateHoverRank={props.updateHoverRank}
//           rank={props.rank}
//         />
//       </div>
//     </div>
//   );
// }
// 
// const mapStateToProps = (state: AppState, props: ExternalProps) => {
//   return {};
// };
// 
// const mapActionsToProps = {
//   beginDrag: DragDropActions.beginDrag,
//   endDrag: DragDropActions.endDrag,
// };
// 
// const Component = connect(mapStateToProps, mapActionsToProps)(DraggableListItemComponent);
// export { Component as DraggableListItemComponent };
